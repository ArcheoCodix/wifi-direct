import {Component, OnDestroy, OnInit} from '@angular/core';

import {CallbackID, PluginListenerHandle, Plugins} from '@capacitor/core';
import {FailureReason, WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';
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
  stateListener: CallbackID;
  infoListener: CallbackID;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.stateListener = WifiDirect.startWatchWifiState((state) => {
      this.showToast('Wifi is ' + state.isEnabled ? 'ON' : 'OFF');
      this.wifiState = state;
    });

    this.infoListener = WifiDirect.startWatchConnectionInfo((info, err) => {
      if (err) {
        console.error('Connection Info : ', FailureReason[err]);
      } else {
        console.log('home --- ', info);
        if (info.groupFormed) {
          this.status += ' ' + (info.isGroupOwner ? 'Host' : 'Client');
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.stateListener) {
      WifiDirect.clearWifiStateWatch({id: this.stateListener});
    }

    if (this.infoListener) {
      WifiDirect.clearInfoConnectionWatch({id: this.infoListener});
    }
  }

  startDiscoveringPeers() {
    this.status = 'Discovery started';
    this.onDiscovering = true;

    WifiDirect.startDiscoveringPeers((req, err) => {
      if (err) {
        console.error('Discover peers : ', FailureReason[err]);
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
        console.error('Stop Discover : ', FailureReason[err]);
        this.onDiscovering = true;
        this.status = 'Stopping discovery failed';
      });
  }

  connect(device: WifiP2pDevice) {
    WifiDirect.connect({device}, (info, err) => {
      if (err) {
        console.error('Connection : ', FailureReason[err]);
        this.status = 'Connection failed';
      } else {
        this.showToast('Connected');
        if (this.onDiscovering) { this.stopDiscoveringPeers(); }
        this.status = 'Connected';
        this.enterToChat({info});
      }
    });
  }

  host() {
    WifiDirect.host()
      .then(() => {
        this.showToast('You\'re hosting');
        this.status = 'You\'re hosting';
        this.enterToChat({info: undefined});
      })
      .catch(reason => {
        console.error('Host : ', FailureReason[reason]);
        this.status = 'hosting failed';
      });
  }

  enterToChat(props: {info: WifiP2pInfo}) {
    this.modalCtrl.create({
      component: ChatingComponent,
      componentProps: props
    })
      .then(modal => {
        modal.present();
      });
  }

  private showToast(message: string) {
    this.toastCtrl.create({
      message,
      showCloseButton: true
    })
      .then(toast => toast.present());
  }
}
