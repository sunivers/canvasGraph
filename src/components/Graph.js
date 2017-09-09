import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';

class Graph extends React.Component {

  constructor(props){
    super(props);

    this.canvas;
    this.tooltip = [];
    this.tooltipText = "";
    this.tooltipStyle = {
      left: 0;
      top: 0;
      display: none;
    };

    this.COLOR_01 = "#46c0c0";
    this.COLOR_02 = "#f35a5c";
    this.COLOR_03 = "#4e92df";
    this.COLOR_04 = "#fecd30";

    this.cvWidth = 740;
    this.cvHeight = 403;
  }

  onMouseMove(e){
    var clientX = e.clientX - this.canvas.offsetLeft;
    var clientY = e.clientY - this.canvas.offsetTop;
    var context = this.canvas.getContext('2d');
    this.tooltip.map((obj, i)=>{
      if(clientX > obj.x && clientX < obj.x+obj.width && clientY > obj.y && clientY < obj.y+obj.width){
        this.drawToolTip(context, obj.x+, obj.y, obj.num, obj.per);
      }
    });
  }

  drawToolTip(ctx, x, y, num, per){
    this.tooltipText = num + "명(" + per + ")";
    this.tooltipStyle = {
      left: x;
      top: y;
      display: 'none';
    };
  }

  componentDidUpdate(){
    this.canvas = ReactDOM.findDOMNode(this);
    var context = this.canvas.getContext('2d');
    this.drawGraph(context);
  }

  drawGraph(ctx){
    var answerObj = {};
    var multiAgeArr = [];
    if(this.props.isDraw){
      if(this.props.selectedData.age.length === 1){
        answerObj = this.caculateData(this.props.selectedData.gender, this.props.selectedData.age[0], this.props.questionKey);
        this.drawPieGraph(ctx, answerObj);
        console.log(answerObj);
      }else{
        for(var i=0; i<this.props.selectedData.age.length; i++){
          answerObj = this.caculateData(this.props.selectedData.gender, this.props.selectedData.age[i], this.props.questionKey);
          multiAgeArr.push(answerObj);
          console.log(answerObj);
          answerObj = {};
        }
        console.log(multiAgeArr);
        this.drawBarGraph(ctx, multiAgeArr);
      }

    }
  }

  drawToolTip(ctx, x, y){
    var rectWidth = 85;
    var rectHeight = 27;
    var cornerRadius = 10;

    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    ctx.beginPath();
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#555";
    // ctx.globalAlpha = "0.8";

    ctx.strokeRect(x+(cornerRadius/2), y+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    ctx.fillRect(x+(cornerRadius/2), y+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    ctx.closePath();
  }

  drawBarGraphBackground(ctx){
    ctx.clearRect(0, 0, this.cvWidth, this.cvHeight);

    ctx.beginPath();
    //y축
    ctx.moveTo(69, 93-37);
    ctx.lineTo(69, 93-37+292);
    ctx.stroke();
    //x축
    ctx.moveTo(70, this.cvHeight-54);
    ctx.lineTo(this.cvWidth-49, this.cvHeight-54);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 0.3;
    //가로 3줄
    ctx.moveTo(70, 92-37);
    ctx.lineTo(this.cvWidth-49, 92-37);
    ctx.stroke();
    ctx.moveTo(70, 92-37+94);
    ctx.lineTo(this.cvWidth-49, 92-37+94);
    ctx.stroke();
    ctx.moveTo(70, 403-54-94);
    ctx.lineTo(this.cvWidth-49, this.cvHeight-54-94);
    ctx.stroke();
    //맨 오른쪽 테두리
    ctx.moveTo(this.cvWidth-48, 93-37);
    ctx.lineTo(this.cvWidth-48, 93-37+292);
    ctx.stroke();
    //세로 3줄
    ctx.beginPath();
    ctx.lineWidth = 0.3;
    ctx.moveTo(224, 93-37);
    ctx.lineTo(224, 93-37+292);
    ctx.stroke();
    ctx.moveTo(224+152, 93-37);
    ctx.lineTo(224+152, 93-37+292);
    ctx.stroke();
    ctx.moveTo(224+152+152, 93-37);
    ctx.lineTo(224+152+152, 93-37+292);
    ctx.stroke();

    ctx.closePath();
  }

  drawBarGraph(ctx, answerArr){
    if(this.props.isDraw){

      var ageArr = this.props.selectedData.age;
      for(var i=0; i<ageArr.length-1; i++){
        for(var j=i+1; j<ageArr.length; j++){
          if(ageArr[i] > ageArr[j]){
            var temp = ageArr[i];
            ageArr[i] = ageArr[j];
            ageArr[j] = temp;
            temp = answerArr[i];
            answerArr[i] = answerArr[j];
            answerArr[j] = temp;
          }
        }
      }

      this.drawBarGraphBackground(ctx);

      var totalA = 0, totalB = 0, totalC = 0, totalD = 0;
      for(var i=0; i<answerArr.length; i++){
        totalA += parseInt(answerArr[i].a);
        totalB += parseInt(answerArr[i].b);
        totalC += parseInt(answerArr[i].c);
        totalD += parseInt(answerArr[i].d);
      }

      for(var i=0; i<ageArr.length; i++){
        switch(i){
          case 0: ctx.fillStyle = this.COLOR_01; break;
          case 1: ctx.fillStyle = this.COLOR_03; break;
          case 2: ctx.fillStyle = this.COLOR_02; break;
          case 3: ctx.fillStyle = this.COLOR_04; break;
        }
        var interval = 220/ageArr.length;
        ctx.beginPath();
        ctx.fillRect(265+i*interval, 32, 10, 10);
        ctx.font = "12px Helvetica";
        ctx.fillStyle = "#000";
        ctx.fillText(ageArr[i]+"대", 280+i*interval, 40);
      }

      var selectedQuestion = this.props.surveyData.questions[this.props.questionKey];
      var questionArr = Object.values(selectedQuestion['question']);
      for(var i=0; i<questionArr.length; i++){
        var interval = (this.cvWidth - 69 - 48)/4;
        ctx.beginPath();
        ctx.fillText(questionArr[i], 103+interval*i, 360, 154);
      }

      var max = Math.ceil(Math.max(totalA, totalB, totalC, totalD)/100)*100+100;
      ctx.beginPath();
      ctx.font = "12px Helvetica";
      ctx.fillStyle = "#000";
      ctx.fillText("0", 50, this.cvHeight-48);
      ctx.fillText(Math.floor(max*1/3), 31, this.cvHeight-48-290+90+105);
      ctx.fillText(Math.floor(max*2/3), 31, this.cvHeight-48-290+90);
      ctx.fillText(max, 31, this.cvHeight-48-295);

      var heightA = Math.floor(totalA*292/max);
      var heightB = Math.floor(totalB*292/max);
      var heightC = Math.floor(totalC*292/max);
      var heightD = Math.floor(totalD*292/max);

      if(ageArr[0]){
        ctx.beginPath();
        ctx.fillStyle = this.COLOR_01;
        ctx.fillRect(101+155*0, 403-56-heightA, 94, heightA);
        ctx.fillRect(101+155*1, 403-56-heightB, 94, heightB);
        ctx.fillRect(101+155*2, 403-56-heightC, 94, heightC);
        ctx.fillRect(101+155*3, 403-56-heightD, 94, heightD);
        ctx.closePath();

        var percentA_0 = ((answerArr[0].a/totalA)).toFixed(2);
        var percentB_0 = ((answerArr[0].b/totalB)).toFixed(2);
        var percentC_0 = ((answerArr[0].c/totalC)).toFixed(2);
        var percentD_0 = ((answerArr[0].d/totalD)).toFixed(2);

        var heightA_0 = Math.ceil(totalA*292/max*percentA_0);
        var heightB_0 = Math.ceil(totalB*292/max*percentB_0);
        var heightC_0 = Math.ceil(totalC*292/max*percentC_0);
        var heightD_0 = Math.ceil(totalD*292/max*percentD_0);

        this.tooltip.push({
          x: 101+155*0,
          y: 403-56-heightA,
          width: 94,
          height: heightA,
          count: answerArr[0].a,
          percent: percentA_0
        })
        this.tooltip.push({
          x: 101+155*1,
          y: 403-56-heightB,
          width: 94,
          height: heightB,
          count: answerArr[0].b,
          percent: percentB_0
        })
        this.tooltip.push({
          x: 101+155*1,
          y: 403-56-heightC,
          width: 94,
          height: heightC,
          count: answerArr[0].c,
          percent: percentC_0
        })
        this.tooltip.push({
          x: 101+155*1,
          y: 403-56-heightD,
          width: 94,
          height: heightD,
          count: answerArr[0].d,
          percent: percentD_0
        })

        if(ageArr[1]){
          ctx.beginPath();
          ctx.fillStyle = this.COLOR_03;
          ctx.fillRect(101, 403-56-heightA+heightA_0, 94, heightA-heightA_0);
          ctx.fillRect(256, 403-56-heightB+heightB_0, 94, heightB-heightB_0);
          ctx.fillRect(411, 403-56-heightC+heightC_0, 94, heightC-heightC_0);
          ctx.fillRect(566, 403-56-heightD+heightD_0, 94, heightD-heightD_0);
          ctx.closePath();

          var percentA_1 = ((answerArr[1].a/totalA)).toFixed(2);
          var percentB_1 = ((answerArr[1].b/totalB)).toFixed(2);
          var percentC_1 = ((answerArr[1].c/totalC)).toFixed(2);
          var percentD_1 = ((answerArr[1].d/totalD)).toFixed(2);

          var heightA_1 = Math.ceil(totalA*292/max*percentA_1);
          var heightB_1 = Math.ceil(totalB*292/max*percentB_1);
          var heightC_1 = Math.ceil(totalC*292/max*percentC_1);
          var heightD_1 = Math.ceil(totalD*292/max*percentD_1);

          if(ageArr[2]){
            ctx.beginPath();
            ctx.fillStyle = this.COLOR_02;
            ctx.fillRect(101, 403-56-heightA+heightA_0+heightA_1, 94, heightA-heightA_0-heightA_1);
            ctx.fillRect(256, 403-56-heightB+heightB_0+heightB_1, 94, heightB-heightB_0-heightB_1);
            ctx.fillRect(411, 403-56-heightC+heightC_0+heightC_1, 94, heightC-heightC_0-heightC_1);
            ctx.fillRect(566, 403-56-heightD+heightD_0+heightD_1, 94, heightD-heightD_0-heightD_1);
            ctx.closePath();

            var percentA_2 = ((answerArr[2].a/totalA)).toFixed(2);
            var percentB_2 = ((answerArr[2].b/totalB)).toFixed(2);
            var percentC_2 = ((answerArr[2].c/totalC)).toFixed(2);
            var percentD_2 = ((answerArr[2].d/totalD)).toFixed(2);

            var heightA_2 = Math.ceil(totalA*292/max*percentA_2);
            var heightB_2 = Math.ceil(totalB*292/max*percentB_2);
            var heightC_2 = Math.ceil(totalC*292/max*percentC_2);
            var heightD_2 = Math.ceil(totalD*292/max*percentD_2);

            if(ageArr[3]){
              ctx.beginPath();
              ctx.fillStyle = this.COLOR_04;
              ctx.fillRect(101, 403-56-heightA+heightA_0+heightA_1+heightA_2, 94, heightA-heightA_0-heightA_1-heightA_2);
              ctx.fillRect(256, 403-56-heightB+heightB_0+heightB_1+heightB_2, 94, heightB-heightB_0-heightB_1-heightB_2);
              ctx.fillRect(411, 403-56-heightC+heightC_0+heightC_1+heightC_2, 94, heightC-heightC_0-heightC_1-heightC_2);
              ctx.fillRect(566, 403-56-heightD+heightD_0+heightD_1+heightD_2, 94, heightD-heightD_0-heightD_1-heightD_2);
              ctx.closePath();

              var percentA_3 = ((answerArr[3].a/totalA)).toFixed(2);
              var percentB_3 = ((answerArr[3].b/totalB)).toFixed(2);
              var percentC_3 = ((answerArr[3].c/totalC)).toFixed(2);
              var percentD_3 = ((answerArr[3].d/totalD)).toFixed(2);

              var heightA_3 = Math.ceil(totalA*292/max*percentA_3);
              var heightB_3 = Math.ceil(totalB*292/max*percentB_3);
              var heightC_3 = Math.ceil(totalC*292/max*percentC_3);
              var heightD_3 = Math.ceil(totalD*292/max*percentD_3);
            }
          }
        }
      }
    }
  }

  drawPieGraph(ctx, answerObj){
    if(this.props.isDraw){
      var total = answerObj.a + answerObj.b + answerObj.c + answerObj.d;
      var percentA = ((answerObj.a/total)).toFixed(2);
      var percentB = ((answerObj.b/total)).toFixed(2);
      var percentC = ((answerObj.c/total)).toFixed(2);
      var percentD = ((answerObj.d/total)).toFixed(2);

      ctx.clearRect(0, 0, this.cvWidth, this.cvHeight);

      var selectedQuestion = this.props.surveyData.questions[this.props.questionKey];
      if(selectedQuestion['question'].a){
        var ARC = (Math.PI/180);

        ctx.beginPath();
        ctx.moveTo(259, 204);
        ctx.arc(259, 204, 150, ARC*270, ARC*630, false);
        ctx.fillStyle = this.COLOR_01;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.COLOR_01;
        ctx.fillRect(528, 160, 10, 10);
        ctx.closePath();

        ctx.font = "12px Helvetica";
        ctx.fillStyle = "#000";
        ctx.fillText(selectedQuestion['question'].a, 545, 170);

        if(selectedQuestion['question'].b){
          var endA = ARC*(360*percentA+270);

          ctx.beginPath();
          ctx.moveTo(259, 204);
          ctx.arc(259, 204, 150, endA, ARC*630, false);
          ctx.fillStyle = this.COLOR_02;
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.fillStyle = this.COLOR_02;
          ctx.fillRect(528, 190, 10, 10);
          ctx.closePath();

          ctx.font = "12px Helvetica";
          ctx.fillStyle = "#000";
          ctx.fillText(selectedQuestion['question'].b, 545, 200);

          if(selectedQuestion['question'].c){
            var endB = ARC*(360*percentA+360*percentB+270);

            ctx.beginPath();
            ctx.moveTo(259, 204);
            ctx.arc(259, 204, 150, endB, ARC*630, false);
            ctx.fillStyle = this.COLOR_03;
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = this.COLOR_03;
            ctx.fillRect(528, 220, 10, 10);
            ctx.closePath();

            ctx.font = "12px Helvetica";
            ctx.fillStyle = "#000";
            ctx.fillText(selectedQuestion['question'].c, 545, 230);

            if(selectedQuestion['question'].d){
              var endC = ARC*(360*percentA+360*percentB+360*percentC+270);

              ctx.beginPath();
              ctx.moveTo(259, 204);
              ctx.arc(259, 204, 150, endC, ARC*630, false);
              ctx.fillStyle = this.COLOR_04;
              ctx.fill();
              ctx.closePath();

              ctx.beginPath();
              ctx.fillStyle = this.COLOR_04;
              ctx.fillRect(528, 250, 10, 10);
              ctx.closePath();

              ctx.font = "12px Helvetica";
              ctx.fillStyle = "#000";
              ctx.fillText(selectedQuestion['question'].d, 545, 260);
            }
          }
        }
      }
    }
  }

  caculateData(_gender, _age, questionKey){
    var surveyArr = this.props.surveyActionData;
    var answerArr = [];
    for(var i in surveyArr){
      if(surveyArr[i].gender===_gender && surveyArr[i].age===_age){
        answerArr.push(surveyArr[i].answer[questionKey]);
      }
    }
    var a = 0, b = 0, c = 0, d = 0;
    answerArr.map(v => {
      (v == "a" ? a++ : (v == "b" ? b++ : (v == "c" ? c++ : (v == "d" ? d++ : 0))));
    });
    var answerObj = { "a": a, "b": b, "c": c, "d": d };
    return answerObj;
  }


  render(){
    return (
      <div>
        <canvas
          className={ClassNames("graph_canvas", {
          active: this.props.isDraw
          })}
          width={740} height={403}
          onMouseMove={this.onMouseMove.bind(this)}
        />
        <div className="tooltip" style={this.tooltipStyle}>
          {this.tooltipText}
        </div>
      </div>
    )

  }
}
export default Graph;
