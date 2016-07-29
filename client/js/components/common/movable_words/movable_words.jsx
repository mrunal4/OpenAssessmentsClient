import React                from "react";
import ReactDOM             from "react-dom";
import { DragDropContext }  from 'react-dnd';
import HTML5Backend         from 'react-dnd-html5-backend';

import DraggableWord        from "../draggable_word";
import { GroupDropZone }    from "../drop_zones";
import WordChain            from "./word_chain";
import CustomDragLayer      from "./custom_drag_layer";

export class MovableWords extends React.Component {
  static propTypes = {
    answers: React.PropTypes.array,
    wordChain: React.PropTypes.array,
    selectAnswer: React.PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {
      answerPositions: {}
    };
  }

  dropWordsInCloud(answerIds, dropOffset) {
    _.each(answerIds, (answerId) => {
      if(_.includes(this.props.wordChain, answerId)) {
        this.props.selectAnswer(answerId);
      }
    });

    let answerPositions = _.cloneDeep(this.state.answerPositions);

    const groupDropZone = ReactDOM.findDOMNode(this.groupDropZone);
    const groupDropZonePosition = groupDropZone.getBoundingClientRect();

    _.each(answerIds, (answerId, index) => {
      answerPositions[answerId] = {
        top: dropOffset.y - groupDropZonePosition.top,
        left: dropOffset.x + index * 60 - groupDropZonePosition.left
      };

      this.setState({answerPositions});
    });
  }

  linkWord(answerId) {
    this.props.selectAnswer(answerId);
  }

  render() {
    const answersById = {};

    _.each(this.props.answers, (answer) => {
      answersById[answer.id] = answer
    })

    const availableWords = _.map(answersById, (answer) => {
      // let style = {}
      // if(this.state.answerPositions[answer.id]) {
      //   style = {position: "absolute", ...this.state.answerPositions[answer.id]}
      // }
      
      return <DraggableWord
        key={answer.id}
        id={answer.id}
        material={answer.material}
        hide={_.includes(this.props.wordChain, answer.id)}
      />
    });

    return <div>
      <div className="c-word-box">
        <GroupDropZone
          ref={(ref) => this.groupDropZone = ref}
          dropItem={(answerIds, dropOffset) => {this.dropWordsInCloud(answerIds, dropOffset)}}
          className="c-word-box__contain"
        >
          {availableWords}
        </GroupDropZone>
      </div>
      <WordChain
        linkWord={(answerId) => { this.linkWord(answerId); }}
        answersById={answersById}
        wordChain={this.props.wordChain}
      />
      <CustomDragLayer />
    </div>
  }
}

export default DragDropContext(HTML5Backend)(MovableWords);
