/** START instantiation tests */
console.time("Vector instantiation test");
for (let i = 0; i < 10000000; i++) {
    const v = new Vector2D(i, i*2);
}
console.timeEnd("Vector instantiation test");

console.time("Object instantiation test");
for (let i = 0; i < 10000000; i++) {
    const v = {x: i, y:i * 2};
}
console.timeEnd("Object instantiation test");

console.time("Array instantiation test");
for (let i = 0; i < 10000000; i++) {
    const v = [i, i*2];
}
console.timeEnd("Array instantiation test");
/** END instantiation tests */

/** START operation tests */
console.time("return operation test");
for (let i = 0; i < 1000000; i++) {
    const v1 = new Vector2D(i, i*2);
    const v2 = new Vector2D(i*4.5, i*9.1);
    v1.add(v2);
    v1.sub(v2);
    v2.normalize();
    v2.mult(i);
}
console.timeEnd("return operation test");

console.time("modify operation test");
for (let i = 0; i < 1000000; i++) {
    const v1 = new Vector2D(i, i*2);
    const v2 = new Vector2D(i*4.5, i*9.1);
    v1.addTo(v2);
    v1.subTo(v2);
    v2.normalizeTo();
    v2.multTo(i);
}
console.timeEnd("modify operation test");
/** END operation tests */