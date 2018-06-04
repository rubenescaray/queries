import React, { Component } from 'react';
import '../../styles/accordion.css';

class Accordion extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: null,
      previousSelected: null,
      firstTime: true,
    };
    this.selectSection = this.selectSection.bind(this);
  }

  selectSection = (event) => {
    this.setState({ firstTime: false });
    const el = event.currentTarget;
    let selected = el.dataset.ident;
    const previousSelected = this.state.selected;

    if (this.props.collapsible) {
      // Reset selected when collapsing a selected section
      if (selected === previousSelected) {
        selected = null;
      }
      this.setState({ selected, previousSelected });
    } else if (selected !== previousSelected) {
      this.setState({
        selected,
        previousSelected
      });
    }
  }

  render() {
    const prefix = 'row-';
    let ident;
    let selected;
    const sections = this.props.sections.map((section, index) => {
      ident = prefix + index;
      console.log('index', index);
      if (index === 0 && this.state.firstTime) {
        selected = true;
      } else {
        selected = ident === this.state.selected && ident !== this.state.previousSelected;
      }
      return (
        <AccordionSection
          ident={ident}
          key={index}
          selected={selected}
          onClick={this.selectSection}
          section={section}
        />
      );
    });
    return (
      <ul className="accordion">
        {sections}
      </ul>
    );
  }
}

Accordion.defaultProps = {
  collapsible: false
};

const AccordionSection = ({ selected, ident, section, onClick }) => {
  const liClass = selected ? 'selected' : '';
  const faClass = selected ? 'fa fa-angle-down' : 'fa fa-angle-right';
  return (
    <li className={liClass}>
      <div className="accordion-header" onClick={onClick} data-ident={ident}>
        <span className="accordion-arrow">
          <i className={faClass} aria-hidden="true" />
        </span>
        <span>{section.header}</span>
      </div>
      <div className="accordion-body">
        <div>{section.body}</div>
      </div>
    </li>
  );
};

export default Accordion;
