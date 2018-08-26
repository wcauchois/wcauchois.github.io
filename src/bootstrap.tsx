import { h, render } from 'preact';
import { App } from './app';
import './styles.less';

render(<App name='cool working lol' />, document.getElementById('app')!);
