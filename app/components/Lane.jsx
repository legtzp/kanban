import React       from 'react';
import connect     from '../libs/connect';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';
import LaneHeader  from './LaneHeader';
import Notes       from './Notes';

import ItemTypes    from '../constants/itemTypes';
import {compose}    from 'redux';
import {DragSource,
        DropTarget} from 'react-dnd';

const Lane = ({
  connectDragSource, connectDropTarget, isDragging, isOver,
  onMove, id, lane, notes, NoteActions, LaneActions, ...props
}) => {

  const editNote = (id, task) => {
    NoteActions.update({id, task, editing: false});
  };

  const deleteNote = (noteId, e) => {
    e.stopPropagation();

    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    });
    NoteActions.delete(noteId);
  };

  const activateNoteEdit = id => {
    NoteActions.update({id, editing: true});
  };

  return compose(connectDragSource, connectDropTarget)(
    <div {...props} style={{opacity: isDragging || isOver ? 0 : 1}}>
      <LaneHeader lane={lane} />
      <Notes
        notes={selectNotesByIds(notes, lane.notes)}
        onNoteClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
};

function selectNotesByIds(allNotes, noteIds = []) {
  return noteIds.reduce((notes, id) =>
    notes.concat(
      allNotes.filter(note => note.id === id)
    )
  , []);
}

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId    = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      })
    }
  }
}

const laneSource = {
  beginDrag(props) {
    return {
      lane: props.lane
    };
  }
};

const laneTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceLane = sourceProps.lane;
    const targetLane = targetProps.lane;

    if(sourceLane !== targetLane) {
      targetProps.onMove({sourceLane, targetLane});
    }
  }
};

export default compose(
  DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.LANE, laneTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })),
  connect(({notes}) => ({
    notes
  }), {
    NoteActions,
    LaneActions
  })
)(Lane);
