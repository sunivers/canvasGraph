import React from 'react';
import SelectButton from './SelectButton';
import GraphSection from './GraphSection';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      genderSelected: -1,
      ageSelected: this.props.surveyData['age'].map(() => false),
      questionsSelected: -1,
      selectedData: {
        gender: "",
        age: [],
        question: {}
      }
    };
  }

  /*----------------------onSelect--------------------------*/
  _onSelectGender(key, _value){
    var copyData = this.state.selectedData;

    if(this.state.genderSelected === key){
      this.setState({
        genderSelected: -1,
        selectedData: Object.assign(copyData, { gender: "" })
      });
      return;
    }
    var newValue = {gender: _value}
    var newState = Object.assign(copyData, newValue);
    this.setState({
      genderSelected: key,
      selectedData: newState
    });
    console.log(key+" is selected");
  }

  _onSelectAge(key, _value){
    var newState = this.state.ageSelected.map((value, i) => {
      if(key === i) {
        return !value;
      }else {
        return value;
      }
    });
    var newData = this.state.selectedData.age;
    var deleteIndex = newData.findIndex(value => {
      if(value == _value){
        return true;
      }
    });
    if(deleteIndex != -1){
      newData.splice(deleteIndex, 1);
    }else {
      newData.push(_value);
    }
    var copyData = this.state.selectedData;
    var newValue = {age: newData};
    var newObj = Object.assign(copyData, newValue);
    console.log(newObj);
    this.setState({
      ageSelected: newState,
      selectedData: newObj
    });
  }

  _onSelectQuestions(key, _value){
    var copyData = this.state.selectedData;

    if(this.state.questionsSelected === key){
      this.setState({
        questionsSelected: -1,
        selectedData: Object.assign(copyData, { question: {} })
      });
      return;
    }
    var newData = Object.assign({}, _value);
    var newValue = {question: newData};
    var newObj = Object.assign(this.state.selectedData, newValue);
    console.log(newObj);
    this.setState({
      questionsSelected: key,
      selectedData: newObj
    });
    console.log(key+" is selected");
  }


  /*------------------------isSelect-------------------------*/
  _isSelectGender(key){
    if(this.state.genderSelected === key){
      return true;
    }else{
      return false;
    }
  }
  _isSelectAge(key){
    if(this.state.ageSelected[key] === true){
      return true;
    }else{
      return false;
    }
  }
  _isSelectQuestions(key){
    if(this.state.questionsSelected === key){
      return true;
    }else{
      return false;
    }
  }


  _isDraw(){
    if((this.state.genderSelected != -1) &&
       (this.state.questionsSelected != -1) &&
       (this.state.ageSelected.some((value)=>value))){
         return true;
       }else{
         return false;
       }
  }

  render(){
    return (
      <div>
        <h3 className="title">{this.props.surveyData.title}</h3>
        <div className="container">
          <ul>
            <li>
              <span className="list_item">성별</span>
              {this.props.surveyData['gender'].map((value, i) => {
                return (
                  <SelectButton
                      text={value==="male"?"남성":"여성"}
                      value={value}
                      key={i}
                      selectedKey={i}
                      onSelect={this._onSelectGender.bind(this)}
                      isSelect={this._isSelectGender.bind(this)(i)}/>
                );
              })}
            </li>
            <li>
              <span className="list_item">연령</span>
              {this.props.surveyData['age'].map((value, i) => {
                return (
                  <SelectButton
                      text={value+"대"}
                      value={value}
                      key={i}
                      selectedKey={i}
                      onSelect={this._onSelectAge.bind(this)}
                      isSelect={this._isSelectAge.bind(this)(i)}/>
                );
              })}
            </li>
            <li>
              <span className="list_item">문항</span>
              {this.props.surveyData['questions'].map((value, i) => {
                return (
                  <SelectButton
                      text={i+1+"번 문항"}
                      value={value}
                      key={i}
                      selectedKey={i}
                      onSelect={this._onSelectQuestions.bind(this)}
                      isSelect={this._isSelectQuestions.bind(this)(i)}/>
                );
              })}
            </li>
          </ul>
          <GraphSection
              isDraw={this._isDraw.bind(this)()}
              surveyData={this.props.surveyData}
              surveyActionData={this.props.surveyActionData}
              questionKey={this.state.questionsSelected}
              selectedData={this.state.selectedData}/>
        </div>
      </div>
    )
  }
}
export default App;
