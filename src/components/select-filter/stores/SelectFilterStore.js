import { observable } from 'mobx';

export class SelectField {
  @observable id;
  @observable name;
  @observable label;
  @observable include;
  @observable type;

  constructor(id, name, label, include, type) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.include = include;
    this.type = type;
  }
}

export default class SelectFilterStore {
  @observable selects = [];

  constructor() {
    this.selects = [];
  }

  fromSchema(schema) {
    const selects = schema.map((schemaField) => {
      return new SelectField(schemaField.id, schemaField.name, '', true, 'text');
    });
    this.selects = selects;
  }

  mixSchemaWithSelects(schema, selects, onlyIncluded) {
    let selectsUpdated = schema.map((schemaField) => {
      const select = selects.find((x) => {
        return x.name === schemaField.name;
      });
      if (select !== undefined) {
        return new SelectField(schemaField.id, select.name, select.label, select.include ? select.include : true, select.type || 'text');
      }
      return new SelectField(schemaField.id, schemaField.name, '', false, 'text');
    });
    if (onlyIncluded === true) {
      selectsUpdated = selectsUpdated.filter((select) => {
        return select.include === true;
      });
    }
    this.selects = selectsUpdated;
  }

  findField = (fielId) => {
    const field = this.selects.find((x) => { return x.id === fielId; });
    return field;
  }
}
