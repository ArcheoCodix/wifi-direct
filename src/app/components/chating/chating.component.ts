import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {PluginListenerHandle, Plugins} from '@capacitor/core';
import {WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';

const {App, WifiDirect} = Plugins;

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.scss'],
})
export class ChatingComponent implements OnInit {

  msgs: string;
  msgWriting: string;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

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
          closeButtonText: 'ok'
        })
          .then(toast => toast.present());
        this.modalCtrl.dismiss();
      })
      .catch(reason => {
        console.log(reason);
        this.toastCtrl.create({
          message: 'Disconnection failed',
          closeButtonText: 'ok'
        })
          .then(toast => toast.present());
      });
  }
}
