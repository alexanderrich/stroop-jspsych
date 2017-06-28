var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

var timeline = [];

var welcome_block = {
    type: "text",
    text: "Welcome to the experiment. Press the SPACE key to begin.",
    cont_key: [' ']
};

timeline.push(welcome_block);


/* add another text trial with instructions */
var instructions_block = {
    type: "text",
    text: "<p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>" +
        "<p>Press the SPACE key to begin.</p>",
    cont_key: [' '],
    /* pause for 1 seconds after finishing instructions */
    timing_post_trial: 1000,
    /* tell the server that the participant has finished the instructions and started the task*/
    on_finish: function(){
        psiturk.finishInstructions();
    }
};

timeline.push(instructions_block);

jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
