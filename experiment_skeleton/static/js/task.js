/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

var timeline = [];

var welcome_block = {
    type: "text",
    text: "Welcome to the experiment. Press the SPACE key to begin."
};

timeline.push(welcome_block);

jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
