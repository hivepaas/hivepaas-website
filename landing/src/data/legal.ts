// What the Terms, Privacy and Refunds pages say about who sells HivePaaS
// licenses. Paddle's website review needs them, naming the seller and a
// contact. A value in brackets is highlighted on the pages as a placeholder
// still to fill in; set `draft` back to true while a change is under review.
export const legal = {
  /** Shows a "draft" notice on the three pages while true. */
  draft: false,
  /**
   * Who sells the licenses: the owner, an individual (sole trader) with no
   * company, by the name on the ID Paddle verifies.
   */
  entityName: 'Đào Công Tiến',
  /** Where they are: city and country only, no street address. */
  address: 'Hanoi, Vietnam',
  /** The law the Terms are governed by, read after "governed by". */
  governingLaw:
    'the laws of Vietnam, with the courts of Hanoi deciding any dispute',
  /** General and legal contact: the one mailbox HivePaaS has. */
  contactEmail: 'support@hivepaas.com',
  /** When the pages last changed in substance: update it on publishing. */
  updated: 'October 17, 2026',
};

/** Whether a value is still a placeholder, such as "[ADDRESS]". */
export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value);
