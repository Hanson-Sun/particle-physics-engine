function animate() {

    count = count + 1;

    for (circ of cl) {

        if (circ.ispivot || circ == currentcirc) {
            circ.vel = new Vector2D(0, 0);
        }

        if (!circ.ispivot || circ == currentcirc) {

            circ.accelerate(circ.force);
            circ.vel = circ.vel.add(gravity.mult(timestep));

            circ.acceleration = new Vector2D(0, 0);
            circ.force = new Vector2D(0, 0);

            circ.prevpos = circ.pos;
            circ.velocity(circ.vel);
            circ.drag();


        }

    }

    if (collide) {
        for (circ of cl) {
            //pos = circ.pos;
            circ.collide();
            circ.edgeDetect();

            circ.pos = circ.prevpos.add(circ.vel.mult(timestep));

            circ.edgeDetectPosition();
            circ.collidecorrect();

            //circ.vel = (circ.pos.sub(pos)).mult(1 / timestep)

        }
    }

    dt = timestep;
    for (let i = 0; i < constraintsIter; i++) {
        for (joint of stiffjoint) {

            joint.update();

        }
    }
    for (circ of cl) {
        if (!circ.ispivot && circ != currentcirc) {
            circ.vel.x = (circ.pos.x - circ.prevpos.x) / timestep;
            circ.vel.y = (circ.pos.y - circ.prevpos.y) / timestep;
            //circ.vel = (circ.pos.sub(circ.prevpos)).mult(1 / timestep);
        }
    }


}
prevtime = -1000;
bruh = 0;

function solver() {
    clear();
    //UI magic dw about this
    if (mouseisdown == true && hold == false) {
        c.beginPath();
        c.arc(startmouse.x, startmouse.y, radius, 0, Math.PI * 2, false);
        c.strokeStyle = "green";
        c.fillStyle = "green";
        c.fill();
        c.stroke();
        c.beginPath();
        c.moveTo(startmouse.x, startmouse.y);
        c.lineTo(endmouse.x, endmouse.y);
        c.stroke();
    } else if (hold == true) {
        c.beginPath();
        c.arc(currentcirc.pos.x, currentcirc.pos.y, currentcirc.radius, 0, Math.PI * 2, false);

        c.fillStyle = "green";
        c.fill();
    }


    //end of UI magic
    for (i = 0; i < iterations; i++) {
        animate();
    }
    for (joint of stiffjoint) {
        joint.draw();
    }
    for (circ of cl) {
        circ.draw();
    }

    time = time + iterations * timestep;
    clock.innerHTML = time;

    //     if (time - prevtime >= 0.5) {
    //     data.push([time, cl[cl.length - 1].pos.y])
    //     console.log(time)
    //     prevtime = time;
    // }

    // if (time > 1503 && bruh == 0) {
    //     download_csv();
    //     bruh++;
    // }

}

//solver();

setInterval(function() {
    if (runsim) {
        solver();
    }

}, 1);

function nextStep() {

    for (let i = 0; i < iterations; i++) {
        solver();
    }
}

// window.addEventListener("mousedown", function(){
// 	solver();
// })


function download_csv() {
    var csv = '';

    for (row of data) {
        csv += row.join(',');
        csv += "\n";
    }

    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'position.csv';
    hiddenElement.click();
}