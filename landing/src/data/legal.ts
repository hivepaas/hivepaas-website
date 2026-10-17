// What the Terms, Privacy and Refunds pages say about who sells HivePaaS
// licenses. These pages are DRAFTS for the owner's review: Paddle's website
// review needs them, naming the legal business and a contact.
//
// TODO(owner): review the three pages (src/pages/terms.astro, privacy.astro,
// refunds.astro), then set `draft` to false. A value in brackets would be
// highlighted on the pages as a placeholder still to fill in.
export const legal = {
  /** Shows a "draft" notice on the three pages while true. */
  draft: true,
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
