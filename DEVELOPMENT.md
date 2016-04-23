# Parser

    Program = { Line }.

    Line = { Identifier ":" } Expression ";".

    Expression = ( ( UnaryOperator Expression) | ( "(" Expression ")" ) | Reference | Call | Constant ) { Operator Expression }. 
    
    Reference = Identifier.
    
    Call = Identifier "(" Expression { "," Expression } ")".
    
    Constant = Object | Array | Value.
    
    Object = "{" Identifier ":" Expression { "," Identifier ":" Expression } [","] "}".
    
    Array = "[" Expression { "," Expression } [","] "]".
    
    Number = number [ Unit ].
    
    Unit = "m" | "km" | ...
    
    
    Value = string | identifier.
    Value must match Value format. 
    
    Operator = "+" | "-" | "*" | "/" | "modulo".
    
    UnaryOperator = "+" | "-".
       
    Identifier = (string | identifier). 
    Identifier must match Identifier format.
    
    
    
    3 in => km
    
    17 km 
    
    N 45° 31.789 
    
    O 013° 45' 13.2"
    
    { foo: "bar" }
    
    
    
    