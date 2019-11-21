import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatingComponent } from './chating.component';

describe('ChatingComponent', () => {
  let component: ChatingComponent;
  let fixture: ComponentFixture<ChatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
