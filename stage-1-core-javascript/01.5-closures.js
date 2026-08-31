/**
 * Closures: a function that outlives the scope it was written in, and keeps it alive.
 *
 * When a function is created it holds a live link to the variables around it. If the
 * function escapes (returned, stored, passed as a callback), those variables escape
 * with it instead of being cleaned up. The link is to the variable itself, not to a
 * copy of its value.
 *
 * Angular tie-in: this is what a `providedIn: 'root'` service is. One instance holds
 * its private state, and every method you call on it is a closure over that state,
 * for as long as the app is running. It's also the leak: a subscription callback
 * closes over the whole component, so failing to unsubscribe keeps the component
 * alive after it's destroyed.
 */
