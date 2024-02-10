module.exports = grammar({
  name: 'mochi',

  rules: {
    source_file: $ => repeat(choice($.comment, $._definition)),

    _definition: $ => choice(
      $.include,
      $.fn,
      $.struct,
      $.enum,
      $.union,
      $.var,
      $.impl,
    ),

    include: $ => seq('include', $.string),

    fn: $ => seq(
      optional('inline'),
      'fn',
      $.fn_name,
      $.fn_args,
      optional($.fn_return),
      $._expr,
    ),

    fn_name: $ => choice(
      $.identifier,
      seq(
        $.type,
        '.',
        $.identifier,
        optional(seq(
          '<',
          repeat1($.type),
          '>',
        ))
      )
    ),

    fn_args: $ => seq(
      '(',
      repeat(choice(
        seq(
          optional('&'),
          $.type,
          ':',
          optional('mut'),
          $.identifier,
        ),
        $.type,
      )),
      ')',
    ),

    fn_return: $ => seq(
      '->',
      $.tuple,
    ),

    struct: $ => seq(
      'struct',
      field('name', $.type),
      choice(
        ':',
        $.struct_body,
      )
    ),

    struct_body: $ => seq(
      '{',
      repeat(
        $.struct_member
      ),
      optional(
        seq(
          'impl', ':',
          repeat($.fn),
        ),
      ),
      '}',
    ),

    struct_member: $ => seq(
      optional('pub'),
      $.type,
      ':',
      $.identifier,
    ),

    enum: $ => seq(
      'enum',
      choice(
        seq(
          'struct',
          field('name', $.type),
          choice(
            ':',
            seq(
              '{',
              repeat(seq($.tuple, ':', $.identifier)),
              '}',
            )
          ),
        ),
        seq(
          field('name', $.type),
          choice(
            ':',
            seq(
              '{',
              repeat($.identifier),
              '}',
            ),
          )
        ),
      ),
    ),

    union: $ => seq(
      'union',
      field('name', $.type),
      $.union_body,
    ),

    union_body: $ => choice(
      ':',
      seq(
        '{',
        repeat(seq(
          $.type,
          ':',
          $.identifier,
        )),
        '}',
      )
    ),

    impl: $ => seq(
      'impl',
      $.type,
      '{',
      repeat($.fn),
      '}',
    ),

    var: $ => seq(
      'var',
      $.type,
      optional(seq('[', $.number, ']')),
      ':',
      $.identifier,
    ),

    _stmt: $ => choice(
      $.if,
      $.while,
      $.as,
      $.var,
      $.match,
    ),

    if: $ => seq(
      'if',
      $.block,
      optional($.else),
    ),

    else: $ => seq(
      'else',
      choice(
        $.block,
        seq(repeat($._literal), $.if),
      ),
    ),

    while: $ => seq(
      'while',
      repeat(choice($._literal, $._stmt)),
      'do',
      $.block,
    ),

    match: $ => seq(
      'match',
      '{',
      repeat(seq(
        $.type, 
        '::', 
        $.type,
        $.block,
      )),
      '}',
    ),

    as: $ => seq(
      'as',
      $.tuple,
    ),

    _expr: $ => choice($.block, $._literal),

    _literal: $ => prec(2, choice(
      $.accessor,
      $.builtin,
      $.identifier, 
      $.type, 
      $.string,
      $.char,
      $.operator,
      $.type_fn_call,
      $.number,
      $.comment,
    )),

    builtin: $ => choice($.sizeOf, $.cast),

    sizeOf: $ => seq(
      'sizeOf',
      '(',
      $.type,
      ')',
    ),

    cast: $ => seq(
      'cast',
      '(',
      $.type,
      ')',
    ),

    block: $ => seq(
      '{',
      repeat(choice($._expr, $._stmt)),
      '}',
    ),

    tuple: $ => seq(
      '[', 
      choice(repeat(
        seq(
          optional('mut'),
          $.identifier,
        ),
      ), repeat($.type)),
      ']',
    ),

    type: $ => choice(
      'u64',
      'bool',
      'char',
      /[A-Z][A-Za-z]*/,
      seq(
        $.type,
        '<',
        repeat($.type),
        '>',
      )
    ),

    type_fn_call: $ => seq(
      $.type,
      '.',
      field('fn_name', $.identifier),
      optional(seq('::', '<', repeat1($.type), '>'))
    ),

    accessor: $ => prec(2, choice(
      seq(
        $.identifier,
        repeat1(seq(
          '::',
          choice(
            $.identifier,
            seq('<', repeat1($.type), '>')
          ),
        )),
      ),
      seq(
        $.type,
        '::',
        $.type,
      ),
    )),

    identifier: _ => /[a-zA-Z_][a-zA-Z_0-9%]*/,
    number: _ => /[0-9]+/,
    string: _ => /"[^"]*"/,
    operator: _ => choice(
      '+', '-', '/', '*',
      '&', '=', '|', '^',
      '@', '!', '<', '>',
      '%',
    ),
    char: _ => seq(
      "'",
      optional('\\'),
      /[^']/,
      "'",
    ),
    comment: _ => /\/\/[^\n]*/,
  },
});
