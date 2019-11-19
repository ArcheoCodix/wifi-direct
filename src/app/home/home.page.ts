import {Component, OnDestroy, OnInit} from '@angular/core';
import {PluginListenerHandle, Plugins} from '@capacitor/core';
import {WifiP2pDevice} from 'capacitor-wifi-direct';

const { App, WifiDirect } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  wifiState: string;
  status = 'Sleep';
  msgs: string;
  devices: WifiP2pDevice[];

  msgWriting: string;

  onDiscovering = false;
  stateListener: PluginListenerHandle;
  requestListener: PluginListenerHandle;

  constructor() {}

  ngOnInit() {
    this.stateListener = WifiDirect.addListener('wifiStateChanged', (state: {isEnabled: boolean}) => {
      this.wifiState = 'Wifi ' + (state.isEnabled ? 'on' : 'off');
    });
  }

  ngOnDestroy() {
    this.stateListener.remove();
  }

  startDiscoveringPeers() {
    WifiDirect.startDiscoveringPeers()
        .then(() => {
          this.status = 'Discovery started';
          this.onDiscovering = true;

          this.requestListener = WifiDirect.addListener('peersDiscovered', (req: {devices: WifiP2pDevice[]}) => {
            this.devices = req.devices;
          });
        })
        .catch(err => {
          console.error(err);
          this.onDiscovering = false;
          this.status = 'Discovery failed';
        });
  }

  sendMsg() {

  }

  writeMsg(msg: CustomEvent) {
    this.msgWriting = msg.detail.value;
  }

  stopDiscoveringPeers() {
    WifiDirect.stopDiscoveringPeers()
        .then(() => {
          this.onDiscovering = false;
          this.requestListener.remove();
          this.status = 'Discovery stopped';
        })
        .catch(err => {
          console.error(err);
          this.onDiscovering = true;
          this.status = 'Stopping discovery failed';
        });
  }
}
