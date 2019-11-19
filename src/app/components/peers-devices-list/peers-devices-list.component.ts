import {Component, Input, OnInit} from '@angular/core';
import {DeviceStatus, WifiP2pDevice} from 'capacitor-wifi-direct';

@Component({
  selector: 'app-peers-devices',
  templateUrl: './peers-devices-list.component.html',
  styleUrls: ['./peers-devices-list.component.scss'],
})
export class PeersDevicesListComponent implements OnInit {
  @Input() devices: WifiP2pDevice[];

  constructor() { }

  ngOnInit() {}

  deviceState(state: DeviceStatus) {
    console.log(DeviceStatus[state]);
    return DeviceStatus[state];
  }
}
