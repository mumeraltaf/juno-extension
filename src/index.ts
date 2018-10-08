import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the juno extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'juno',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension juno is activated!');
  }
};

export default extension;
