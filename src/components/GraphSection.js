import React from 'react';
import ClassNames from 'classnames';
import Graph from './Graph';

class GraphSection extends React.Component {
  render(){

    var question = "";
    if(this.props.isDraw){
      question = this.props.surveyData.questions[this.props.questionKey].title;
    }

    return (
      <div className="graph_area">
        <div className={ClassNames("notice", {
          active: !this.props.isDraw
          })}>
          <p>상단의 옵션을 선택하면, <br />그래프가 보여집니다.</p>
        </div>
        <p className="question">{question}</p>
        <Graph isDraw={this.props.isDraw}
          surveyData={this.props.surveyData}
          surveyActionData={this.props.surveyActionData}
          questionKey={this.props.questionKey}
          selectedData={this.props.selectedData}/>
        
      </div>
    )
  }
}
export default GraphSection;
