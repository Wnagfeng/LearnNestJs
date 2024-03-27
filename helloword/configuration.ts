/* eslint-disable */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';
const YAML_CONFIG_FILENAME = 'config/config.yml';
const filePath = join(__dirname, '../', YAML_CONFIG_FILENAME);
const envfilePath = join(
  __dirname,
  '../',
  `config/config.${process.env.NODE_ENV || 'development'}.yml`,
);
const commonConfig = yaml.load(readFileSync(filePath, 'utf8'));
const envConfig = yaml.load(readFileSync(envfilePath, 'utf8'));
export default () => {
  return _.merge(commonConfig, envConfig); // 读取yaml配置文件并解析为json对象返回
};
