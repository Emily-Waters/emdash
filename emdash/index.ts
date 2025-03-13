import * as _array from "./array";
import * as _async from "./async";
import * as _class_ from "./class_";
import * as _crypto from "./crypto";
import * as _fs from "./fs";
import * as _math from "./math";
import * as _object from "./object";
import * as _performance from "./performance";
import * as _string from "./string";
import * as _types from "./types";

export namespace emdash {
  export import array = _array;
  export import async = _async;
  export import class_ = _class_;
  export import crypto = _crypto;
  export import fs = _fs;
  export import math = _math;
  export import object = _object;
  export import performance = _performance;
  export import string = _string;
  export import types = _types;
}

export const {
  array,
  async,
  class_,
  crypto,
  fs,
  math,
  object,
  performance,
  string,
  types
} = {
  array: _array,
  async: _async,
  class_: _class_,
  crypto: _crypto,
  fs: _fs,
  math: _math,
  object: _object,
  performance: _performance,
  string: _string,
  types: _types
};

export default emdash;