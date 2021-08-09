function gencloth() {
    let grid = [];
    let size = 10;
    let w = 30;
    let stiffness = 0.1;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(350 + col * w, 150 + row * w);
            circ = new circle(cl, p2, v, 0.1, 0, 5, 0.99, "black")
            r.push(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col], w, breakforce, 1, stiffness);
            }
            if (col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row][col + 1], w, breakforce, 1, stiffness);
            }
        }
    }

    for (circ of grid[0]) {
        //circ.ispivot = true;
    }
    grid[0][0].ispivot = true;
    grid[0][size - 1].ispivot = true;

}

function gentruss() {
    w = 20
    h = (w ** 2 - (w / 2) ** 2) ** 0.5
    s = breakforce;
    p = new Vector2D(200 + w / 2, 300);

    p3 = new Vector2D(200, 300 + h);
    c1 = new circle(cl, p, v, 20, 0, 5, 1, "black");
    c3 = new circle(cl, p3, v, 20, 0, 5, 1, "black");
    c1.ispivot = true;
    c3.ispivot = true;

    for (i = 1; i < 30; i++) {
        p2 = new Vector2D(200 + w / 2 + i * w, 300 + i * 0);
        p4 = new Vector2D(200 + i * w, 300 + h + i * 0);
        c2 = new circle(cl, p2, v, 20, -0, 5, 1, "black");
        c4 = new circle(cl, p4, v, 20, -0, 5, 1, "black");

        new Stiffjoint(stiffjoint, c1, c2, w, s, stiffness);
        new Stiffjoint(stiffjoint, c2, c4, w, s, stiffness);
        new Stiffjoint(stiffjoint, c4, c3, w, s, stiffness);
        new Stiffjoint(stiffjoint, c3, c1, w, s, stiffness);
        new Stiffjoint(stiffjoint, c1, c4, w, s, stiffness);
        c1 = c2;
        c3 = c4;
    }
    c3.ispivot = true;
    c2.ispivot = true;
}


function genbeam() {
    w = 20;
    p = new Vector2D(200, 300);

    p3 = new Vector2D(200, 300 + w);
    c1 = new circle(cl, p, v, 20, 0, 5, 1, "black");
    c3 = new circle(cl, p3, v, 20, 0, 5, 1, "black");

    c1.ispivot = true;
    c3.ispivot = true;

    for (i = 1; i < 30; i++) {
        p2 = new Vector2D(200 + i * w, 300 + i * 0);
        p4 = new Vector2D(200 + i * w, 300 + w + i * 0);
        c2 = new circle(cl, p2, v, 20, -0, 5, 1, "black");
        c4 = new circle(cl, p4, v, 20, -0, 5, 1, "black");

        new Stiffjoint(stiffjoint, c1, c2, w, breakforce, stiffness);
        new Stiffjoint(stiffjoint, c2, c4, w, breakforce, stiffness);
        new Stiffjoint(stiffjoint, c4, c3, w, breakforce, stiffness);
        new Stiffjoint(stiffjoint, c3, c1, w, breakforce, stiffness);
        new Stiffjoint(stiffjoint, c1, c4, (2 * w * w) ** 0.5, breakforce, stiffness);
        new Stiffjoint(stiffjoint, c2, c3, (2 * w * w) ** 0.5, breakforce, stiffness);
        c1 = c2;
        c3 = c4;


    }

    c3.ispivot = true;
    c2.ispivot = true;
}

function genpendulum() {

    p2 = new Vector2D(650, 200);
    p4 = new Vector2D(550, 200);

    circ3 = new circle(cl, p2, v, 1, -0, 3, 1, "black");
    var circ4 = new circle(cl, p4, v, 10, -0, 10, 1, "black");
    circ3.ispivot = true;
    new Stiffjoint(stiffjoint, circ3, circ4, 100, breakforce);

    p2 = new Vector2D(350, 200);
    p4 = new Vector2D(150, 200);

    circ3 = new circle(cl, p2, v, 1, -0, 3, 1, "black");
    var circ4 = new circle(cl, p4, v, 20, -0, 15, 1, "black");
    circ3.ispivot = true;
    new Stiffjoint(stiffjoint, circ3, circ4, 200, breakforce);



}

function doublependulum() {
    p2 = new Vector2D(500, 200);
    p4 = new Vector2D(400, 200);
    p5 = new Vector2D(350, 150);
    circ3 = new circle(cl, p2, v, 1, -0, 3, 1, "black");
    circ4 = new circle(cl, p4, v, 10, -0, 10, 1, "black");
    circ5 = new circle(cl, p5, v, 10, -0, 10, 1, "black");
    circ3.ispivot = true;
    new Stiffjoint(stiffjoint, circ3, circ4, 100, breakforce);
    new Stiffjoint(stiffjoint, circ4, circ5, 100, breakforce);

}

function softbody() {
    dampen = 0;
    grid = [];
    size = 8;
    w = 20;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(400 + col * w, 100 + row * w);
            circ = new circle(cl, p2, v, 10, 0, 4, 1, "black")
            r.push(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col], w, breakforce, dampen, stiffness);
            }
            if (col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row][col + 1], w, breakforce, dampen, stiffness);

            }
            if (row + 1 < size && col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
            }
        }
    }

    for (circ of grid[0]) {
        //circ.ispivot = true;
    }

}

function rigidbody() {
    dampen = 0;
    grid = [];
    size = 4;
    w = 20;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(100 + col * w, 200 + row * w);
            circ = new circle(cl, p2, v, 5, 0, 7, 1, "black")
            r.push(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col], w, breakforce, dampen, stiffness);
            }
            if (col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row][col + 1], w, breakforce, dampen, stiffness);

            }
            if (row + 1 < size && col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
            }
        }
    }

    for (circ of grid[0]) {
        //circ.ispivot = true;
    }

    dampen = 0;
    grid = [];
    size = 3;
    w = 20;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(300 + col * w, 200 + row * w);
            circ = new circle(cl, p2, v, 5, 0, 7, 1, "black")
            r.push(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col], w, breakforce, dampen, stiffness);
            }
            if (col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row][col + 1], w, breakforce, dampen, stiffness);

            }
            if (row + 1 < size && col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
            }
        }
    }

    for (circ of grid[0]) {
        //circ.ispivot = true;
    }

    dampen = 0;
    grid = [];
    size = 2;
    w = 20;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(500 + col * w, 200 + row * w);
            circ = new circle(cl, p2, v, 5, 0, 7, 1, "black")
            r.push(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col], w, breakforce, dampen, stiffness);
            }
            if (col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row][col + 1], w, breakforce, dampen, stiffness);

            }
            if (row + 1 < size && col + 1 < size) {
                new Stiffjoint(stiffjoint, grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
                new Stiffjoint(stiffjoint, grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, breakforce, dampen, stiffness);
            }
        }
    }

    for (circ of grid[0]) {
        //circ.ispivot = true;
    }
}

function cradle() {
    w = 450
    h = 200;
    v = new Vector2D(0, 0)
    p2 = new Vector2D(w - 21, h);
    p4 = new Vector2D(w - 21 - 100, h);

    circ3 = new circle(cl, p2, v, 10, -0, 1, 1, "black");
    var circ4 = new circle(cl, p4, v, 10, -0, 10, 1, "black");
    circ3.ispivot = true;
    new Stiffjoint(stiffjoint, circ3, circ4, 100, breakforce, 0, 0.1);
    for (i = 0; i < 10; i++) {
        v = new Vector2D(0, 0)
        p2 = new Vector2D(w + i * 21, h);
        p4 = new Vector2D(w + i * 21, h + 100);

        circ3 = new circle(cl, p2, v, 10, -0, 1, 1, "black");
        var circ4 = new circle(cl, p4, v, 10, -0, 10, 1, "black");
        circ3.ispivot = true;
        new Stiffjoint(stiffjoint, circ3, circ4, 100, breakforce, 0, 0.1);
    }

}

function spring() {

    p2 = new Vector2D(500, 100);
    p4 = new Vector2D(500, 500);
    circ3 = new circle(cl, p2, v, 10, -0, 10, 1, "black");
    var circ4 = new circle(cl, p4, v, 10, -0, 10, 1, "black");
    circ3.ispivot = true;
    new Stiffjoint(stiffjoint, circ3, circ4, 300, breakforce, 0, stiffness);

}