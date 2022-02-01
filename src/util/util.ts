import * as R from 'ramda'

export const rand = (...args: number[]): number => {
    if (args.length === 0) {
        return Math.random()
    } else if (args.length === 1) {
        return Math.random() * args[0]
    } else if (args.length === 2) {
        return rand(args[1] - args[0]) + args[0]
    } else {
        throw new Error()
    }
}

Object.assign(window, { rand })

export const irand = R.pipe(rand, Math.round)

export const range = (n: number) => [...Array(n).keys()]

export const randFrom = <T>(arr: Array<T>): T => {
    if (!arr.length) throw new Error
    const at = irand(arr.length - 1)
    return arr[at]
}

export const randSet = <T>(arr: Array<T>, value: T): void => {
    const at = irand(arr.length - 1)
    arr[at] = value
}

export const randSetWith = <T>(arr: Array<T>, callback: (value: T) => T): void => {
    const at = irand(arr.length - 1)
    arr[at] = callback(arr[at])
}

export const normalize = (xs: number[]) => {
    const sum = R.sum(xs.map(Math.abs))
    if (sum === 0) return xs
    return xs.map(x => x / sum)
}

export const nrandv = (n: number) => R.pipe(range, R.map(() => rand(-1, 1)), normalize)(n)

export const includes = (from: number, to: number, value: number) => from <= value && value <= to

const sameSign = (a: number, b: number) => (a * b) > 0;

export const sigma = (x: number) => 1 / (1 + Math.exp(-x))

export function intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number){
	var a1, a2, b1, b2, c1, c2;
	var r1, r2 , r3, r4;
	var denom, offset, num;

	// Compute a1, b1, c1, where line joining points 1 and 2
	// is "a1 x + b1 y + c1 = 0".
	a1 = y2 - y1;
	b1 = x1 - x2;
	c1 = (x2 * y1) - (x1 * y2);

	// Compute r3 and r4.
	r3 = ((a1 * x3) + (b1 * y3) + c1);
	r4 = ((a1 * x4) + (b1 * y4) + c1);

	// Check signs of r3 and r4. If both point 3 and point 4 lie on
	// same side of line 1, the line segments do not intersect.
	if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
		return 0; //return that they do not intersect
	}

	// Compute a2, b2, c2
	a2 = y4 - y3;
	b2 = x3 - x4;
	c2 = (x4 * y3) - (x3 * y4);

	// Compute r1 and r2
	r1 = (a2 * x1) + (b2 * y1) + c2;
	r2 = (a2 * x2) + (b2 * y2) + c2;

	// Check signs of r1 and r2. If both point 1 and point 2 lie
	// on same side of second line segment, the line segments do
	// not intersect.
	if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
		return 0; //return that they do not intersect
	}

	//Line segments intersect: compute intersection point.
	denom = (a1 * b2) - (a2 * b1);

	if (denom === 0) {
		return 1; //collinear
	}

	// lines_intersect
	return 1; //lines intersect, return true
}
