import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {PluginListenerHandle, Plugins} from '@capacitor/core';
import {WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';

const {App, WifiDirect} = Plugins;

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.scss'],
})
export class ChatingComponent implements OnInit, OnDestroy {

  msgs: string;
  msgWriting: string;
  private infoListener: PluginListenerHandle;
  private requestListener: PluginListenerHandle;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.infoListener = WifiDirect.addListener('connectionInfoAvailable', (info: WifiP2pInfo) => {
      console.log(info);
    });
  }

  ngOnDestroy() {
    this.infoListener.remove();
    this.requestListener.remove();
  }

  sendMsg() {

  }

  writeMsg(msg: CustomEvent) {
    this.msgWriting = msg.detail.value;
  }

  disconnect() {
    WifiDirect.disconnect()
      .then(() => {
        this.toastCtrl.create({
          message: 'Disconnected',
          showCloseButton: true
        })
          .then(toast => toast.present());
        this.modalCtrl.dismiss();
      })
      .catch(reason => {
        console.log(reason);
        this.toastCtrl.create({
          message: 'Disconnection failed',
          showCloseButton: true
        })
          .then(toast => toast.present());
      });
  }
}
