var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

var timeline = [];

var welcome_block = {
    type: "text",
    text: "Welcome to the experiment. Press the SPACE key to begin.",
    cont_key: [' ']
};

timeline.push(welcome_block);

var instructions_block = {
    type: "text",
    text: "<p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>" +
        "<p>Press the SPACE key to begin.</p>",
    cont_key: [' '],
    timing_post_trial: 1000,
    on_finish: function(){
        psiturk.finishInstructions();
    }
};

timeline.push(instructions_block);

var word1 = {
    /* use 'single-stim' plugin type */
    type: 'single-stim',
    /* the stimulus is a formatted html string of a large, red word */
    stimulus:   "<p style='font-size: 50px; color: red;'>SHIP</p>",
    /* "choices" are the acceptable response buttons*/
    choices: ['r','g', 'b'],
    /*tell jsPsych the stimulus is html, not an image file*/
    is_html: true,
    /* data lets us save additional relevant data - anything you'll want in your data table later */
    data: {word: 'SHIP', color: 'red', stimulus_type: 'unrelated', correct_response: 'R'},
    /* we can add another field to the trial's data after the response using on_finish */
    on_finish: function(d){
        d.correct = d.key_press == d.correct_response.charCodeAt(0);
    }
};

timeline.push(word1);

var word2 = {
    type: 'single-stim',
    stimulus: "<p style='font-size: 50px; color: blue;'>RED</p>",
    choices: ['r','g', 'b'],
    is_html: true,
    data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B'},
    on_finish: function(d){
        d.correct = d.key_press == d.correct_response.charCodeAt(0);
    }
};

timeline.push(word2);


jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline
});
