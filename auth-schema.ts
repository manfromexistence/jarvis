import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
					id: text('id').primaryKey(),
					name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: integer('email_verified', { mode: 'boolean' }).$defaultFn(() => false).notNull(),
 image: text('image'),
 createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }),
 role: text('role'),
 banned: integer('banned', { mode: 'boolean' }),
 banReason: text('ban_reason'),
 banExpires: integer('ban_expires', { mode: 'timestamp' })
				});

export const session = sqliteTable("session", {
					id: text('id').primaryKey(),
					expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
 token: text('token').notNull().unique(),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 activeOrganizationId: text('active_organization_id'),
 impersonatedBy: text('impersonated_by')
				});

export const account = sqliteTable("account", {
					id: text('id').primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
 refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
 scope: text('scope'),
 password: text('password'),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
				});

export const verification = sqliteTable("verification", {
					id: text('id').primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
 createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date())
				});

export const organization = sqliteTable("organization", {
					id: text('id').primaryKey(),
					name: text('name').notNull(),
 slug: text('slug').unique(),
 logo: text('logo'),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
 metadata: text('metadata')
				});

export const member:any = sqliteTable("member", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 role: text('role').notNull(),
 createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
				});

export const invitation = sqliteTable("invitation", {
					id: text('id').primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
 email: text('email').notNull(),
 role: text('role'),
 status: text('status').default("").notNull(),
 expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
 inviterId: text('inviter_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const twoFactor = sqliteTable("two_factor", {
					id: text('id').primaryKey(),
					secret: text('secret').notNull(),
 backupCodes: text('backup_codes').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
				});

export const passkey = sqliteTable("passkey", {
					id: text('id').primaryKey(),
					name: text('name'),
 publicKey: text('public_key').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 credentialID: text('credential_i_d').notNull(),
 counter: integer('counter').notNull(),
 deviceType: text('device_type').notNull(),
 backedUp: integer('backed_up', { mode: 'boolean' }).notNull(),
 transports: text('transports'),
 createdAt: integer('created_at', { mode: 'timestamp' })
				});

export const oauthApplication = sqliteTable("oauth_application", {
					id: text('id').primaryKey(),
					name: text('name'),
 icon: text('icon'),
 metadata: text('metadata'),
 clientId: text('client_id').unique(),
 clientSecret: text('client_secret'),
 redirectURLs: text('redirect_u_r_ls'),
 type: text('type'),
 disabled: integer('disabled', { mode: 'boolean' }),
 userId: text('user_id'),
 createdAt: integer('created_at', { mode: 'timestamp' }),
 updatedAt: integer('updated_at', { mode: 'timestamp' })
				});

export const oauthAccessToken = sqliteTable("oauth_access_token", {
					id: text('id').primaryKey(),
					accessToken: text('access_token').unique(),
 refreshToken: text('refresh_token').unique(),
 accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
 refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
 clientId: text('client_id'),
 userId: text('user_id'),
 scopes: text('scopes'),
 createdAt: integer('created_at', { mode: 'timestamp' }),
 updatedAt: integer('updated_at', { mode: 'timestamp' })
				});

export const oauthConsent = sqliteTable("oauth_consent", {
					id: text('id').primaryKey(),
					clientId: text('client_id'),
 userId: text('user_id'),
 scopes: text('scopes'),
 createdAt: integer('created_at', { mode: 'timestamp' }),
 updatedAt: integer('updated_at', { mode: 'timestamp' }),
 consentGiven: integer('consent_given', { mode: 'boolean' })
				});
