using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace txConditionalCells.Models
{
    public class CellFilterInstructions
    {
        public double? CompareValue { get; set; } = null;
        public RelationalOperator? Operator { get; set; } = null;
        public Color TrueColor { get; set; } = Color.White;
        public Color FalseColor { get; set; } = Color.White;

        public enum RelationalOperator
        {
            Equals = 0,
            NotEqual,
            LessThan,
            GreaterThan,
        }


        // evaluates the instruction and returns the proper color
        public Color? GetColor(string value)
        {
            if (Double.TryParse(ParseToNumber(value), out double dValue) == true)
            {
                switch (Operator)
                {
                    case RelationalOperator.Equals:
                        return (dValue == CompareValue ? TrueColor : FalseColor);
                    case RelationalOperator.NotEqual:
                        return (dValue != CompareValue ? TrueColor : FalseColor);
                    case RelationalOperator.GreaterThan:
                        return (dValue > CompareValue ? TrueColor : FalseColor);
                    case RelationalOperator.LessThan:
                        return (dValue < CompareValue ? TrueColor : FalseColor);
                    default:
                        return null;
                }
            }
            else
                return null;

        }

        private string ParseToNumber(string text)
        {
            var numericChars = "0123456789,.".ToCharArray();
            return new String(text.Where(c => numericChars.Any(n => n == c)).ToArray());
        }
    }

}