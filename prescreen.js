//*** THERANOS PRESCREEN ***//
//***  SCOTT W. COMPTON  ***//



//@@  PROBLEM 1  @@//

/*rectangle
 *A rectangle represented by its center point, sizeX, and sizeY.
 */
function Rectangle(x, y, sizeX, sizeY)
{
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
}

/*rectangle.overlaps
 *Returns true if this rectangle overlaps with the other.
 */
Rectangle.prototype.overlaps = function(r2)
{
    var xDist = Math.abs(r2.x - this.x);
    var yDist = Math.abs(r2.y - this.y);

    var xOff = ((r2.sizeX / 2) + (this.sizeX / 2));
    var yOff = ((r2.sizeY / 2) + (this.sizeY / 2));

    return ((xOff > xDist) && (yOff > yDist));
}

//Analysis:
//Time Complexity:  1
//Space Complexity: 1



//@@  PROBLEM 3  @@//

/*partition
 *Sorting component of quicksort. In this version, sort string length descending.
 */
function partition(arr, left, right, pivot)
{
    var pivotVal = arr[pivot];
    arr[pivot] = arr[right];
    arr[right] = pivotVal;
    var store = left;

    for(var i = left; i < right; i++)
        if(arr[i].length >= pivotVal.length) {
            var storeVal = arr[store];
            arr[store] = arr[i];
            arr[i] = storeVal;
            store++;
        }

    var storeVal = arr[store];
    arr[store] = arr[right];
    arr[right] = storeVal;
    return store;
}

/*quicksort
 *Sorting algorithm.
 */
function quicksort(arr, left, right)
{
    if(left < right) {
        var pivot = right;
        var newPivot = partition(arr, left, right, pivot);

        quicksort(arr, left, (newPivot - 1));
        quicksort(arr, (newPivot + 1), right);
    }
}

/*checkWord
 *Recursively checks if there is a valid concatenation of shorter words.
 *Returns empty string if there is, the word itself otherwise.
 */
function checkWord(arr, word, start)
{
    for(var i = start; i < arr.length; i++)
        if(word.indexOf(arr[i]) != -1)
            if(checkWord(arr, word.replace(arr[i], ''), (i + 1)) == '')
                return '';

    return word;
}

/*getLongestWord
 *Sorts the array by descending string length, finds longest word that is..
 *  a valid concatenation of other words in the array.
 */
function getLongestWord(arr)
{
    quicksort(arr, 0, (arr.length - 1));

    for(var i = 0; i < arr.length; i++) {
        var word = arr[i];

        if(checkWord(arr, word, (i + 1)) == '')
            return word;
    }
    return '';
}

//Analysis:
//Time complexity varies.
    //Best Case:    n*log(n) for quicksort, constant time for checking the word (if the largest word is a concatenation of the next largest words).
    //Worst Case:   n! for checking the words. This happens whenever there is no valid concatenation of words.
    //Average Case: n! / (n/2)!, assuming a valid word is found halfway down the list. This depends greatly on the skew of the data though.

//Space complexity is constant for quicksort, and n for the deepest recursion of checkWord.



//@@  PROBLEM 5  @@//

/*getPower
 *Get the maximum power that base can be raised to and be lower than the value.
 */
function getPower(val, base)
{
    var power = 0;
    var checkVal = val;

    while(checkVal > base) {
        checkVal = checkVal / base;
        power++;
    }

    return power;
}

/*isOdd
 *Returns true if the number is odd. Used on palindrome length.
 */
function isOdd(num)
{
    return (num % 2);
}

/*getNextPal
 *
 *Returns the next largest palindrome.
 *Examines each digit from the middle up. Reduces by 1, and cascades reduction if necessary.
 *Adjusts the digits from the middle down symmetrically.
 */
function getNextPal(pal)
{
    var newPal = 0;
    var power = getPower(pal, 10);

    var adjust = true;
    var adjusted = false;

    for(var i = Math.ceil(power / 2); i <= power; i++) {
        /** Get value at this index irrespective of power (0-9) **/
	    var value = (((pal % Math.pow(10, (i + 1))) - (pal % Math.pow(10, i))) / Math.pow(10, i));

	    if(adjust) {
		    if(value == 0) {
			    adjust = true;
			    value = 9;
		    } else {
			    adjust = false;
			    value = (value - 1);
		    }

		    if((value == 0) && (i == power)) {
			    newPal += 9;
			    break;
		    }
	    }

	    newPal += (value * Math.pow(10, i));

	    if(isOdd(power) || adjusted)
		    newPal += (value * Math.pow(10, (power - i)));

        adjusted = true;
    }

    return newPal;
}

/*isMultipleK
 *Returns true if the palindrome is a multiple of two k-length multipliers.
 */
function isMultipleK(pal, minM, maxM)
{
    for(var m1 = maxM; m1 >= minM; m1--) {
        if((m1 * maxM) < pal)
            break;

        for(var m2 = maxM; m2 >= minM; m2--) {
            if((m1 * m2) == pal)
                return true;
            if((m1 * m2)  < pal)
                break;
        }
    }
    return false;
}

/*getLargestPal
 *Returns the largest palindrome that is divisible by two numbers with k digits each.
 */
function getLargestPal(k)
{
    var minM = 0;
    var maxM = 0;
    for(var i = k; i > 0; i--) {
        minM = ((minM == 0) ? 1 : (minM * 10));
        maxM = ((maxM * 10) + 9);
    }

    var pal = getNextPal(maxM * maxM);

    while(!isMultipleK(pal, minM, maxM))
        pal = getNextPal(pal);

    return pal;
}

//Analysis:
//The largest source of running time comes from checking if the palindrome is divisible by k-length multipliers.
//The number of pairs needing to be checked grows quickly with k (10^(2k) to be exact) but I reduced it greatly by..
//  adding conditions to exit the loops early.

//I can't say the time complexity for sure, though.

//Space Complexity: 1
