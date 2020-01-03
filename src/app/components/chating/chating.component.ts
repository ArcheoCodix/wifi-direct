import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {CallbackID, PluginListenerHandle, Plugins} from '@capacitor/core';
import {FailureReason, WifiP2pDevice, WifiP2pInfo} from 'capacitor-wifi-direct';

const {App, WifiDirect} = Plugins;

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.scss'],
})
export class ChatingComponent implements OnInit, OnDestroy {
  @Input() info: WifiP2pInfo;

  peerType: string;
  msgs: string;
  msgWriting: string;
  private infoListener: CallbackID;
  private requestListener: PluginListenerHandle;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    if (this.info) {
      if (this.info.groupFormed) {
        this.peerType = this.info.isGroupOwner ? 'Host' : 'Client';
      } else {
        this.modalCtrl.dismiss();
      }
    }

    this.infoListener = WifiDirect.startWatchConnectionInfo((info, err) => {
      if (err) {
        console.error('Connection Info : ', FailureReason[err]);
      } else {
        console.log('chating --- ', info);
        if (info.groupFormed) {
          this.peerType = info.isGroupOwner ? 'Host' : 'Client';
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.infoListener) {
      WifiDirect.clearInfoConnectionWatch({id: this.infoListener});
    }

    if (this.requestListener) {
      this.requestListener.remove();
    }
  }

  sendMsg() {

  }

  writeMsg(msg: CustomEvent) {
    this.msgWriting = msg.detail.value;
  }

  disconnect() {
    this.modalCtrl.dismiss();
  }
}
