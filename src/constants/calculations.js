export const CONDITION_TYPES_MAP = {
  SELECT: [
    { code: 'LIST_OPTION', name: 'List option' },
    { code: 'LIST_OTHER', name: 'List other value' }
  ],
  RANGE: [
    { code: 'RANGE_SPLIT', name: 'Less than x' },
    { code: 'RANGE_MAX', name: 'Range upper boundary' }
  ],
  BOOLEAN: [
    { code: 'BOOL_TRUE', name: 'True' },
    { code: 'BOOL_FALSE', name: 'False' }
  ],
  ANY_VALUE: [
    { code: 'ANY_VALUE', name: 'Has any value' },
    { code: 'NO_VALUE', name: 'Is null' }
  ]
};

export const RULE_METRIC_MAP = {
  RANGE: 'NUMBER',
  SELECT: 'TEXT',
  BOOLEAN: 'BOOLEAN',
  ANY_VALUE: 'TEXT' 
};