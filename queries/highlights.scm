[
 "match"
 "union"
 "enum"
 "inline"
 "var"
 "fn"
 "if"
 "while"
 "else"
 "include"
 "struct"
 "pub"
 "impl"
 "sizeOf"
 "cast"
 "mut"
 "do"
 "as"
] @keyword

(fn_name) @function
(fn_name ["<" ">" "."] @punctuation)
(struct name: (type) @type)
(type_fn_call fn_name: (identifier) @function)
(enum name: (type) @type)

(type) @type
(type ["<" ">"] @punctuation)
(string) @string
(operator) @operator
(number) @constant.numeric
(char) @constant.character
(comment) @comment
(ERROR) @error
