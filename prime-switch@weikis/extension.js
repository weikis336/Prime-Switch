import Gio from 'gi://Gio';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { PopupMenuItem, PopupSeparatorMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class PrimeSwitchExtension extends Extension {
    enable() {
        this._indicator = new PanelMenu.Button(0.0, 'Prime Switch');

        const icon = new St.Icon({
            icon_name: 'video-display-symbolic',
            style_class: 'system-status-icon',
        });

        this._indicator.add_child(icon);

        const modes = ['nvidia', 'intel', 'on-demand'];

        for (const mode of modes) {
            const item = new PopupMenuItem(`Switch to ${mode}`);
            item.connect('activate', () => {
                this._runPrimeSelect(mode);
            });
            this._indicator.menu.addMenuItem(item);
        }

        this._indicator.menu.addMenuItem(new PopupSeparatorMenuItem());

        const rebootItem = new PopupMenuItem('Reboot Now');
        rebootItem.connect('activate', () => {
            this._runCommand(['reboot']);
        });
        this._indicator.menu.addMenuItem(rebootItem);

        Main.panel.addToStatusArea('prime-switch', this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }

    _runPrimeSelect(mode) {
        this._runCommand(['pkexec', 'prime-select', mode]);
    }

    _runCommand(argv) {
        try {
            Gio.Subprocess.new(argv, Gio.SubprocessFlags.NONE);
        } catch (e) {
            console.error(`Failed to run command: ${argv.join(' ')}\n${e}`);
        }
    }
}
