import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import './GriddlePager.css';

const Combo = (props) => {
  const options = [];
  const styles = {
    customWidth: {
      width: 50,
    }
  };
  for (let i = 0; i < props.maxPage; i++) {
    const selected = props.currentPage === i ? 'selected' : '';
    options.push(<MenuItem key={i} value={i} primaryText={i + 1} selected={selected} />);
  }
  return (
    <SelectField style={styles.customWidth} floatingLabelText="páginas" onChange={props.pageChange} value={props.currentPage}>
      {options}
    </SelectField>
  );
};

class GriddlePager extends Component {
  constructor(props) {
    super(props);
    this.pageChange = this.pageChange.bind(this);
  }
  pageChange(event, index, value) {
    this.props.setPage(value);
  }

  render() {
    let previous = '';
    let next = '';

    if (this.props.currentPage > 0) {
      previous = <FlatButton label="anterior" onClick={this.props.previous} />;
    }

    if (this.props.currentPage !== (this.props.maxPage - 1)) {
      next = <FlatButton label="siguiente" onClick={this.props.next} />;
    }
    let startIndex = Math.max(this.props.currentPage - 5, 0);
    const endIndex = Math.min(startIndex + 11, this.props.maxPage);

    if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
      startIndex = endIndex - 11;
    }

    return (

      <div className="custom-pager">
        <div>{previous}</div>
        <div>
          <Combo
            pageChange={this.pageChange}
            maxPage={this.props.maxPage}
            currentPage={this.props.currentPage}
          />
        </div>
        <div>{next}</div>
      </div>

    );
  }
}

export default GriddlePager;
