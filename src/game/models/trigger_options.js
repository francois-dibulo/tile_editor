//
var Condition = {};
Condition.Trigger = {};
Condition.Action = {};
Condition.Tool = {
  SelectCell: 'select_cell',
  SelectObject: 'select_object',
  SelectType: 'select_type',
  SelectWaypoints: 'select_waypoints'
};

// ===================================
// ACTIONS
// ===================================
Condition.Action.ObjectState = {
  template: 'src/editor/partials/_trigger_action_state_view.html',
  label: 'Set state'
};

Condition.Action.Move = {
  label: 'Move'
};

// ===================================
// TIME CONDITION
// ===================================
Condition.Trigger.TimeTrigger = {
  class_name: 'TimeTrigger',
  label: "Time",
  template: "src/editor/partials/_trigger_time_view.html"
};

// ===================================
// EVENT CONDITION
// ===================================
Condition.Trigger.ObjectEventTrigger = {
  class_name: 'ObjectEventTrigger',
  label: "Event",
  template: "src/editor/partials/_trigger_event_view.html"
};

// ===================================
// COLLISION
// ===================================
Condition.Trigger.ObjectCollisionTrigger = {
  label: "Collision",
  class_name: 'ObjectCollisionTrigger',
  template: "src/editor/partials/_trigger_collision_condition_view.html"
};
