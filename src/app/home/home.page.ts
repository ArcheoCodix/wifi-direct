import {Component, OnDestroy, OnInit} from '@angular/core';

import {PluginListenerHandle, Plugins} from '@capacitor/core';
import {WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';
import {ModalController, ToastController} from '@ionic/angular';
import {ChatingComponent} from '../components/chating/chating.component';
import {BehaviorSubject, Subscription} from 'rxjs';

const {App, WifiDirect} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  status = 'Sleep';
  devices: WifiP2pDevice[];
  private wifiState: { isEnabled: boolean };

  onDiscovering = false;
  stateListener: PluginListenerHandle;
  stateObservable: Subscription;
  infoListener: PluginListenerHandle;

  private dataWifiState = new BehaviorSubject<{ isEnabled: boolean }>(this.wifiState);
  public currentState = this.dataWifiState.asObservable();

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.stateListener = WifiDirect.addListener('wifiStateChanged', (state: { isEnabled: boolean }) => {
      this.dataWifiState.next(state);
    });

    this.stateObservable = this.currentState.subscribe((state) => {
       this.wifiState = state;
    });

    this.infoListener = WifiDirect.addListener('connectionInfoAvailable', (info: WifiP2pInfo) => {
      console.log('home --- ', info);
      if (info.groupFormed) {
        this.status += ' ' + (info.isGroupOwner ? 'Host' : 'Client');
      }
    });
  }

  ngOnDestroy() {
    if (this.stateListener) {
      this.stateListener.remove();
    }

    if (this.stateObservable) {
      this.stateObservable.unsubscribe();
    }

    if (this.infoListener) {
      this.infoListener.remove();
    }
  }

  startDiscoveringPeers() {
    this.status = 'Discovery started';
    this.onDiscovering = true;

    WifiDirect.startDiscoveringPeers((req, err) => {
      if (err) {
        console.error(err);
        this.onDiscovering = false;
        this.status = 'Discovery failed';
      } else {
        this.devices = req.devices;
      }
    });
  }

  stopDiscoveringPeers() {
    WifiDirect.stopDiscoveringPeers()
      .then(() => {
        this.onDiscovering = false;
        this.status = 'Discovery stopped';
      })
      .catch(err => {
        console.error(err);
        this.onDiscovering = true;
        this.status = 'Stopping discovery failed';
      });
  }

  connect(device: WifiP2pDevice) {
    WifiDirect.connect({device})
      .then(() => {
        this.toastCtrl.create({
          message: 'Connected',
          showCloseButton: true
        })
          .then(toast => toast.present());
        if (this.onDiscovering) { this.stopDiscoveringPeers(); }
        this.status = 'Connected';
        this.enterToChat();
      })
      .catch(reason => {
        console.log(reason);
        this.status = 'Connection failed';
      });
  }

  host() {
    WifiDirect.host()
      .then(() => {
        this.toastCtrl.create({
          message: 'You\'re hosting',
          showCloseButton: true
        })
          .then(toast => toast.present());
        this.status = 'You\'re hosting';
        this.enterToChat();
      })
      .catch(reason => {
        console.log(reason);
        this.status = 'hosting failed';
      });
  }

  enterToChat() {
    this.modalCtrl.create({
      component: ChatingComponent
    })
      .then(modal => {
        modal.present();
      });
  }
}
