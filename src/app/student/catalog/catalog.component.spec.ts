import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogComponent } from './catalog.component';

function createFixture(): ComponentFixture<CatalogComponent> {
  const fixture = TestBed.createComponent(CatalogComponent);
  fixture.detectChanges();
  return fixture;
}

function texte(fixture: ComponentFixture<CatalogComponent>): string {
  return fixture.nativeElement.textContent as string;
}

describe('CatalogComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideRouter([])],
    });
  });

  it('n expose que les quiz publies aux eleves', () => {
    const contenu = texte(createFixture());

    // Deux quiz publies, un brouillon.
    expect(contenu).toContain('Les capitales du monde');
    expect(contenu).toContain('Culture cinéma');
    expect(contenu).not.toContain('Les inventions qui ont changé le monde');
  });

  it('filtre la liste selon la recherche', () => {
    const fixture = createFixture();
    const champ = fixture.nativeElement.querySelector('input[name="search"]') as HTMLInputElement;

    champ.value = 'cinéma';
    champ.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(texte(fixture)).toContain('Culture cinéma');
    expect(texte(fixture)).not.toContain('Les capitales du monde');
  });

  it('filtre la liste selon la difficulte minimale', () => {
    const fixture = createFixture();
    const selection = fixture.nativeElement.querySelector('select[name="min-difficulty"]') as HTMLSelectElement;

    // Chaque quiz propose au moins une question facile : en exigeant la
    // difficulte maximale, plus aucun quiz ne correspond.
    selection.value = '3';
    selection.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(texte(fixture)).toContain('Aucun quiz disponible');
  });
});
