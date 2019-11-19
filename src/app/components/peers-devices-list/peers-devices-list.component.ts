import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceStatus, WifiP2pDevice} from 'capacitor-wifi-direct';

@Component({
  selector: 'app-peers-devices',
  templateUrl: './peers-devices-list.component.html',
  styleUrls: ['./peers-devices-list.component.scss'],
})
export class PeersDevicesListComponent implements OnInit {
  @Input() devices: WifiP2pDevice[];
  @Output() deviceSelected = new EventEmitter<WifiP2pDevice>();

  constructor() { }

  ngOnInit() {}

  deviceState(state: DeviceStatus) {
    return DeviceStatus[state];
  }
}
