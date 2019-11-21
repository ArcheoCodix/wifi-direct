import {Component, OnDestroy, OnInit} from '@angular/core';

import {PluginListenerHandle, Plugins} from '@capacitor/core';
import {WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';
import {ModalController, ToastController} from "@ionic/angular";
import {ChatingComponent} from "../components/chating/chating.component";

const {App, WifiDirect} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  wifiState: string;
  status = 'Sleep';
  devices: WifiP2pDevice[];

  onDiscovering = false;
  stateListener: PluginListenerHandle;
  requestListener: PluginListenerHandle;
  infoListener: PluginListenerHandle;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.stateListener = WifiDirect.addListener('wifiStateChanged', (state: { isEnabled: boolean }) => {
      this.wifiState = 'Wifi ' + (state.isEnabled ? 'on' : 'off');
    });

    this.infoListener = WifiDirect.addListener('connectionInfoAvailable', (info: WifiP2pInfo) => {
      console.log(info);
      if (info.groupFormed) {
        this.status += ' ' + (info.isGroupOwner ? 'Host' : 'Client');
      }
    });
  }

  ngOnDestroy() {
    if (this.stateListener) {
      this.stateListener.remove();
    }

    if (this.infoListener) {
      this.infoListener.remove();
    }
  }

  startDiscoveringPeers() {
    WifiDirect.startDiscoveringPeers()
      .then(() => {
        this.status = 'Discovery started';
        this.onDiscovering = true;

        this.requestListener = WifiDirect.addListener('peersDiscovered', (req: { devices: WifiP2pDevice[] }) => {
          this.devices = req.devices;
        });
      })
      .catch(err => {
        console.error(err);
        this.onDiscovering = false;
        this.status = 'Discovery failed';
      });
  }

  stopDiscoveringPeers() {
    WifiDirect.stopDiscoveringPeers()
      .then(() => {
        this.onDiscovering = false;
        this.requestListener.remove();
        console.log(this.requestListener);
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
          closeButtonText: 'ok'
        })
          .then(toast => toast.present());
        this.stopDiscoveringPeers();
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
          closeButtonText: 'ok'
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
