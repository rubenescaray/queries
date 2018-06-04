import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
//import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ShareIcon from 'material-ui/svg-icons/social/share';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { inject, observer } from 'mobx-react';
import '../../styles/react-table.css';
import Palette from '../../Palette';

const styles = {
  actionIcon: {
    color: Palette.table.actionIconColor,
    margin: '0px 10px',
    cursor: 'pointer',
  },
  addButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  actionIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }
};

const IconPreviewComponent = (props) => {
  return <VisibilityIcon onClick={props.metadata.showExecute.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconEditComponent = (props) => {
  return <ModeEditIcon onClick={props.metadata.showEdit.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconFavoriteComponent = (props) => {
  return <FavoriteBorderIcon onClick={props.metadata.favoriteAction.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconShareComponent = (props) => {
  return <ShareIcon onClick={props.metadata.shareAction.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

@inject('sourceListStore')
@observer
class SourceList extends Component {
  componentDidMount() {
    this.props.sourceListStore.fetch(false);
  }
  showAdd = () => {
    this.props.router.push('/sources/create');
  }
  showExecute = (source) => {
    this.props.router.push(`/sources/preview/${source.id}`);
  }
  showEdit = (source) => {
    this.props.router.push(`/sources/edit/${source.id}`);
  }
  favoriteAction = (source) => {
    console.log(source.id);
  }
  shareAction = (source) => {
    console.log(source.id);
  }
  pageChange = (currentPage) => {
    this.props.sourceListStore.setCurrentPage(currentPage);
  }
  render() {
    const customPreviewComponentMetadata = { showExecute: this.showExecute };
    const customEditComponentMetadata = { showEdit: this.showEdit };
    const customFavoriteComponentMetadata = { favoriteAction: this.favoriteAction };
    const customShareComponentMetadata = { shareAction: this.shareAction };

    const data = this.props.sourceListStore.sources.length > 0 ? this.props.sourceListStore.sources : [];
    const columns = [{
      Header: 'Id',
      accessor: 'id',
      show: false
    }, {
      Header: 'NOMBRE',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'DESCRIPCIÓN',
      accessor: 'description',
    }, {
      Header: 'ACCIONES',
      maxWidth: 250,
      Cell: (row) => {
        if (!row.aggregated) {
          return (
            <div style={styles.actionIconContainer}>
              <IconPreviewComponent metadata={customPreviewComponentMetadata} rowData={row} />
              <IconEditComponent metadata={customEditComponentMetadata} rowData={row} />
              <IconFavoriteComponent metadata={customFavoriteComponentMetadata} rowData={row} />
              <IconShareComponent metadata={customShareComponentMetadata} rowData={row} />
            </div>
          );
        }

        return (null);
      }
    }];

    return (
      <div>
        {
          <ReactTable
            page={this.props.sourceListStore.currentPage}
            loading={this.props.sourceListStore.fetching}
            data={data}
            columns={columns}
            onPageChange={this.pageChange}
            previousText="« Ant"
            nextText="Sig »"
          />
        }
        <FloatingActionButton style={styles.addButton} onClick={this.showAdd}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default SourceList;
