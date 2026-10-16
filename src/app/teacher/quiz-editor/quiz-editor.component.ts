import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Difficulty, Question, Quiz } from '../../core/models';
import { QuizService, uid } from '../../core/quiz.service';

@Component({
  selector: 'app-quiz-editor',
  imports: [],
  templateUrl: './quiz-editor.component.html',
})
export class QuizEditorComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly quiz = signal<Quiz | null>(null);
  protected readonly saved = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.quizService.getQuiz(id);
      if (existing) {
        this.quiz.set({ ...existing, questions: existing.questions.map((q) => ({ ...q, options: [...q.options] })) });
        return;
      }
    }
    const now = Date.now();
    this.quiz.set({
      id: uid('quiz'),
      title: '',
      description: '',
      teacherId: this.auth.currentUser()?.id ?? '',
      status: 'draft',
      questions: [
        { id: uid('q'), text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', difficulty: 1 },
      ],
      timeLimitSec: 120,
      createdAt: now,
      updatedAt: now,
    });
  }

  protected get questions(): Question[] {
    return this.quiz()?.questions ?? [];
  }

  protected onMetaTitleInput(event: Event): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    q.title = (event.target as HTMLInputElement).value;
    q.updatedAt = Date.now();
  }

  protected onMetaDescriptionInput(event: Event): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    q.description = (event.target as HTMLInputElement).value;
    q.updatedAt = Date.now();
  }

  protected onMetaTimeLimitInput(event: Event): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value) && value > 0) {
      q.timeLimitSec = Math.min(600, Math.max(15, Math.round(value)));
      q.updatedAt = Date.now();
    }
  }

  protected addQuestion(): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const last = q.questions[q.questions.length - 1];
    const nextDifficulty = last ? (Math.min(3, last.difficulty + 1) as Difficulty) : 1;
    q.questions.push({
      id: uid('q'),
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      difficulty: nextDifficulty,
    });
    q.updatedAt = Date.now();
  }

  protected removeQuestion(index: number): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    q.questions.splice(index, 1);
    q.updatedAt = Date.now();
  }

  protected updateQuestion(index: number, patch: Partial<Question>): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    q.questions[index] = { ...q.questions[index], ...patch };
    q.updatedAt = Date.now();
  }

  protected updateOption(questionIndex: number, optionIndex: number, value: string): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const options = [...q.questions[questionIndex].options];
    options[optionIndex] = value;
    q.questions[questionIndex] = { ...q.questions[questionIndex], options };
    q.updatedAt = Date.now();
  }

  protected addOption(questionId: string): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const question = q.questions.find((x) => x.id === questionId);
    if (!question) {
      return;
    }
    const options = [...question.options, `Option ${question.options.length + 1}`];
    question.options = options;
    q.updatedAt = Date.now();
  }

  protected removeOption(questionId: string, optionIndex: number): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const question = q.questions.find((x) => x.id === questionId);
    if (!question) {
      return;
    }
    const options = question.options.filter((_, i) => i !== optionIndex);
    const correctIndex = question.correctIndex >= options.length ? 0 : question.correctIndex;
    question.options = options;
    question.correctIndex = correctIndex;
    q.updatedAt = Date.now();
  }

  protected onQuestionText(index: number, event: Event): void {
    this.updateQuestion(index, { text: (event.target as HTMLInputElement).value });
  }

  protected onOptionText(questionId: string, optionIndex: number, event: Event): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const question = q.questions.find((x) => x.id === questionId);
    if (!question) {
      return;
    }
    const options = [...question.options];
    options[optionIndex] = (event.target as HTMLInputElement).value;
    question.options = options;
    q.updatedAt = Date.now();
  }

  protected onExplanationInput(index: number, event: Event): void {
    this.updateQuestion(index, { explanation: (event.target as HTMLInputElement).value });
  }

  protected onDifficultyChange(index: number, event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.updateQuestion(index, { difficulty: value as Difficulty });
  }

  protected onCorrectSelect(questionId: string, optionIndex: number): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const question = q.questions.find((x) => x.id === questionId);
    if (question) {
      question.correctIndex = optionIndex;
      q.updatedAt = Date.now();
    }
  }

  protected save(publish = false): void {
    const q = this.quiz();
    if (!q) {
      return;
    }
    const cleaned: Quiz = {
      ...q,
      title: q.title.trim(),
      description: q.description.trim(),
      questions: q.questions
        .map((question) => ({
          ...question,
          text: question.text.trim(),
          options: question.options.map((o) => o.trim()),
          explanation: question.explanation.trim(),
        }))
        .filter((question) => question.text.length > 0),
      status: publish ? 'published' : q.status === 'published' ? 'published' : 'draft',
      updatedAt: Date.now(),
    };
    if (cleaned.title.length === 0 || cleaned.questions.length === 0) {
      this.saved.set(false);
      return;
    }
    this.quizService.saveQuiz(cleaned);
    this.quiz.set(cleaned);
    this.saved.set(true);
    if (publish) {
      void this.router.navigate(['/dashboard']);
    }
  }

  protected cancel(): void {
    void this.router.navigate(['/dashboard']);
  }
}
