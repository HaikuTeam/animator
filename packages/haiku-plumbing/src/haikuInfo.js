import {merge} from 'lodash';
import envInfo from './envInfo';

export default function haikuInfo () {
  const {flags, folder, socket} = envInfo();

  if (!process.env.HAIKU_ENV) {
    process.env.HAIKU_ENV = JSON.stringify(merge(flags, {folder, socket, dotenv: {}}));
  }

  const HAIKU = JSON.parse(process.env.HAIKU_ENV || '{}');

  return HAIKU;
}
