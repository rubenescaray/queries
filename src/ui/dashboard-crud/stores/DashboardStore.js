import { observable } from 'mobx';

class DashboardStore {

  @observable toggleLabel;
  @observable currentComponent;
  @observable isEditing;

  constructor(isEditing) {
    this.changeToggleLabel(isEditing);
  }

  checkedCurrentComponent = (isEditing, editDashboardComponent, executeDashboardComponent) => {
    this.currentComponent = (isEditing === 'true' || isEditing === true) ? editDashboardComponent : executeDashboardComponent;
  }

  changeToggleLabel = (isEditing) => {
    this.toggleLabel = isEditing === true || isEditing === 'true' ? 'Ir a Ejecutar Dashboard' : 'Ir a Editar Dashboard';
  }

}

export default DashboardStore;
