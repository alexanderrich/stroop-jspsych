/*
 load psiturk:
 - uniqueId, adServerLoc, and mode are parameters passed in to javascript by the psiTurk server.
 */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

/* the timeline array is the top-level structure of the experiment */
var timeline = [];

/* create a simple text trial welcoming the participant */
var welcome_block = {
    type: "text",
    text: "Welcome to the experiment. Press the SPACE key to begin."
    /* challenge: set welcome_block to only end when the user presses SPACE*/
};

/* using the "push" method, we can add trials to the timeline as we go along */
timeline.push(welcome_block);


/*
 initialize jsPsych:
 - display_element is the id of the html element in which trials will display
 - timeline is the array of trials to use
 */
jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
