/**
 * editDistance.js
 * 
 * A simple Levenshtein distance calculator, except weighted such
 * that insertions at the beginning and deletions at the end cost less.
 *
 * AUTHOR: Pat Littell
 * LAST UPDATED: 2015-05-16
 */

var distanceCalculator = {

    insertionCost : 1.0,
    deletionCost : 1.0,
    insertionAtBeginningCost : 0.11,
    deletionAtEndCost : 0.1,
    substitutionCost : 1.0,
   
    getEditDistance : function(a, b) {
      if(a.length === 0) return b.length; 
      if(b.length === 0) return a.length; 
     
      var matrix = [];
     // var currentInsertionCost, currentDeletionCost, currentSubstitutionCost = 0;
      
      // increment along the first column of each row
      var i;
      for(i = 0; i <= b.length; i++){
        matrix[i] = [i * this.insertionAtBeginningCost];
      }
     
      // increment each column in the first row
      var j;
      for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
      }
     
      // Fill in the rest of the matrix
      for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            currentInsertionCost = matrix[i][j-1] + this.insertionCost;
            currentSubstitutionCost = matrix[i-1][j-1] + (b.charAt(i-1) != a.charAt(j-1) ? this.substitutionCost : 0);
            currentDeletionCost = matrix[i-1][j] + (j==a.length ? this.deletionAtEndCost : this.deletionCost);            
            matrix[i][j] = Math.min(currentSubstitutionCost, Math.min(currentInsertionCost, currentDeletionCost));
          
        }
      }
     
      return matrix[b.length][a.length];
    },
    
    
    // Given a query <a> and a series of targets <bs>, return the least distance to any target
    getLeastEditDistance : function(a, bs) {
        var that = this;
        return Math.min.apply(null, bs.map(function(b) {
            return that.getEditDistance(a,b);
        }));
    }
}