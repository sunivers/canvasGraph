import React from 'react';
import ClassNames from 'classnames';

class SelectButton extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(nextProps) != JSON.stringify(this.props));
  }

  handleClick() {
    this.props.onSelect(this.props.selectedKey, this.props.value);
  }

  render() {
    return (
      <button className={ClassNames("item_button", {
          active: this.props.isSelect
        })}
        onClick={this.handleClick.bind(this)}>
        {this.props.text}</button>
    )
  }
}
export default SelectButton;
