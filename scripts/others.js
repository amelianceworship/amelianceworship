'use strict';

function transposeChord(chord, amount) {
    let scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return chord.replace(/[CDEFGAB]#?/g,
            function(match) {
            var i = (scale.indexOf(match) + amount) % scale.length;
            return scale[ i < 0 ? i + scale.length : i ];
            });
}

export {
    transposeChord,
};
