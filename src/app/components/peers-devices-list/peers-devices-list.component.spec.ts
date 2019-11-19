import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeersDevicesListComponent } from './peers-devices-list.component';

describe('PeersDevicesComponent', () => {
  let component: PeersDevicesListComponent;
  let fixture: ComponentFixture<PeersDevicesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeersDevicesListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeersDevicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
