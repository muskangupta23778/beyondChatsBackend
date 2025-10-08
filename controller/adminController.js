const UserActivity = require('../model/userActivity');

// GET /api/admin/activities
async function getAllUserActivities(req, res) {
  try {
    const activities = await UserActivity.aggregate([
      {
        $sort: { updatedAt: 1 }
      },
      {
        $group: {
          _id: '$email',
          name: { $last: '$name' },
          email: { $last: '$email' },
          lastAttempt: { $last: '$attempt' },
          // Attempt to average numeric results; non-numeric will be treated as NaN and excluded via $addFields later
          resultsArray: { $push: '$result' },
          lastUpdatedAt: { $last: '$updatedAt' },
        }
      },
      {
        $addFields: {
          averageResult: {
            $let: {
              vars: {
                numericResults: {
                  $map: {
                    input: '$resultsArray',
                    as: 'r',
                    in: {
                      $convert: {
                        input: {
                          $trim: {
                            input: { $replaceAll: { input: '$$r', find: '%', replacement: '' } },
                            chars: ' '
                          }
                        },
                        to: 'double',
                        onError: null,
                        onNull: null
                      }
                    }
                  }
                }
              },
              in: {
                $cond: [
                  { $gt: [ { $size: { $filter: { input: '$$numericResults', as: 'nr', cond: { $ne: ['$$nr', null] } } } }, 0 ] },
                  {
                    $avg: {
                      $filter: {
                        input: '$$numericResults',
                        as: 'nr',
                        cond: { $ne: ['$$nr', null] }
                      }
                    }
                  },
                  null
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          attempt: '$lastAttempt',
          result: {
            $cond: [
              { $ne: ['$averageResult', null] },
              { $concat: [ { $toString: { $round: ['$averageResult', 2] } }, '%' ] },
              null
            ]
          },
          date: '$lastUpdatedAt'
        }
      },
      { $sort: { date: -1 } }
    ]);
    return res.json({ activities });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
  }
}

module.exports = { getAllUserActivities };


