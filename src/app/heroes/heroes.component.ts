import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  constructor(private heroService: HeroService ) { }
  selectedHero: Hero;
  heroes: Hero[];

  private getHeroes() {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes );
  }

  add(name: String): void {
    name = name.trim();
    if (!name) { return;}
    this.heroService.addHero({ name } as Hero )
    .subscribe(hero => {
      this.heroes.push(hero);
    })
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
  public onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  ngOnInit() {
    this.getHeroes();
  }

}
