/** @format */
export const logItemsSchema = {
	type: 'object',
	patternProperties: {
		'^\\d+$': {
			type: 'array',
			items: {
				additionalProperties: false,
				type: 'object',
				required: [
					'activityDate',
					'activityGroup',
					'activityIcon',
					'activityId',
					'activityName',
					'activityTitle',
					'activityTs',
					'actorAvatarUrl',
					'actorName',
					'actorRole',
					'actorType',
				],
				properties: {
					activityDate: { type: 'string' },
					activityGroup: { type: 'string' },
					activityIcon: { type: 'string' },
					activityId: { type: 'string' },
					activityName: { type: 'string' },
					activityTitle: { type: 'string' },
					activityTs: { type: 'integer' },
					actorAvatarUrl: { type: 'string' },
					actorName: { type: 'string' },
					actorRemoteId: { type: 'integer' },
					actorRole: { type: 'string' },
					actorType: { type: 'string' },
					actorWpcomId: { type: 'integer' },
				},
			},
		},
	},
	additionalProperties: false,
};
